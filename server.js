const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'));

server.listen(port, () => {
    console.log(`socket.io server listening on port ${port}`);
});

app.get('/', (request, response) => {
    response.redirect('./public/index.html');
});

let controllingId = {
    userId: '',
    socketId: ''
};

let clientIds = [];
let carIds = []

//prevents repeat ID for connected users
function isIdInUse(id, idArray) {
    let found = idArray.find((element) => {
        return element.userId == id;
    });
    return found ? true : false;
}

function generateId(identifier) {
    let id = '';
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let idArray = [];
    if (identifier === 'client') {
        idArray = clientIds;
    } else if (identifier === 'car') {
        idArray = carIds;
    }

    while (!id && !isIdInUse(id, idArray)) {
        id = '';
        for (let i = 0; i < 4; i++) {
            id += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    }
    return id;
}

function transferControl(userId) {
    if(!userId && clientIds[0]) {
        controllingId = clientIds[0].socketId;
    } else {
        controllingId.userId = '';
        controllingId.socketId = '';
        clientIds.forEach((client) => {
            if (client.userId === userId) {
                controllingId = client.socketId;
                console.log('controlling socket id:', controllingId);
                return;
            }
        });
        if(!controllingId) console.log('No clients connected');
    }
}

function removeSocketId(socket) {
    clientIds = clientIds.filter((element) => element.socketId !== socket.id);
    console.log(`removed socket from clientIds: ${clientIds}`);
}

io.on('connection', (socket) => {
    console.log('Connection established');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        removeSocketId(socket);
        if (controllingId.socketId === socket.id) {
            console.log('controlling user has disconnected');
            transferControl();
            io.sockets.to(controllingId.socketId).emit('canControl', true);
        }
        socket.broadcast.emit('controllingUser', controllingId.userId);
    });

    //connection has identied itself as a client browser or a car
    socket.on('identifier', (data) => {
        let genereatedId = generateId();
        if (data === 'client') {
            const client = {
                userId: genereatedId,
                socketId: socket.id
            }
            clientIds.push({ socketId: socket.id, userId: genereatedId });
            console.log(`Client added to clientIds. ${clientIds.length} connected`);
            if (!controllingId.socketId) {
                controllingId = client;
                console.log(`New controlling user: ${controllingId.userId}`);
                socket.emit('canControl', true);
            } else {
                socket.emit('canControl', false);
            }
        } else if (data === 'car') {
            carIds.push({ socketId: socket.id, userId: genereatedId });
        }
        socket.emit('userId', genereatedId);
        socket.broadcast.emit('connectedUsers', clientIds.map((client) => client.userId));
        socket.emit('connectedUsers', clientIds.map((client) => client.userId));
        socket.emit('controllingUser', controllingId.userId);
    });

    socket.on('routes', (data) => {
        socket.broadcast.emit('routes', data);
    });

    //repeating playback command from client to car
    socket.on('playbackRoute', (data) => {
        socket.broadcast.emit('playbackRoute', data);
    });

    //controlling client has chosed another client ID to control the car
    socket.on('transferControl', (data) => {
        // clientIds.forEach((client) => {
        //     if (client.userId === data) {
        //         controllingId = client.socketId;
        //         console.log(`New controlling socket ID: ${controllingId}`);
        //     }
        // });
        let user = clientIds.find((client) => {
            return client.userId === data;
        });
        controllingId = user;
        console.log(`New controlling user: ${controllingId.userId}`)
        socket.broadcast.emit('controllingUser', data);
    });

    // NOTE: repeat socket event names might be causing issue with matchmaking
    socket.on('transferControl', (data) => {
        console.log(`transferring control to ${data}`);
        transferControl(data);
    });

    // repeats controls from client to car; only the controlling user's inputs will be repeated
    socket.on('controlsInput', (data) => {
        if (socket.id === controllingId.socketId) {
            socket.broadcast.emit('controlsOutput', data);
        }
    });

    socket.on('carConnected', (data) => {
        console.log('sending car connection info to browser client');
        socket.broadcast.emit('carConnected', data);
    });

    socket.on('cameraConn', (data) => {
        console.log('Pi camera connected');
    });

    // repeats ultrasonic sensor distance reading from car to client
    socket.on('newDistance', (data) => {
        socket.broadcast.emit('newDistance', data);
    });

    // Playback controls

    socket.on('playbackControls', (data) => {
        console.log('Sending playback controls to pi');
        socket.broadcast.emit('playbackControls', data);
    });

    socket.on('controlRecording', (data) => {
        console.log('Sending record start or stop request to pi');
        socket.broadcast.emit('controlRecording', data);
    });

    socket.on('playbackComplete', () => {
        console.log('Playback complete')
        socket.broadcast.emit('playbackComplete');
    });

    // end of playback controls

    // repeats video frame from car to client
    socket.on('frame', (data) => {
        socket.broadcast.emit('frame', data);
    });
})
