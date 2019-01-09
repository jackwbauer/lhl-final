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

let controllingSocketId = '';

let clientIds = [];
let carIds = []

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
        controllingSocketId = clientIds[0].socketId;
    } else {
        clientIds.forEach((client) => {
            if (client.userId === userId) {
                controllingSocketId = client.socketId;
                console.log('controlling socket id:', controllingSocketId);
                return;
            }
        });
        controllingSocketId = '';
        console.log('No clients connected');
    }
}

function removeSocketId(socket) {
    clientIds = clientIds.filter((element) => element.socketId !== socket.id);
    console.log(`removed socket from clientIds: ${clientIds}`);
}

io.on('connection', (socket) => {
    console.log('Connection established');
    // socket.broadcast.emit('connectedUsers', clientIds.map((client) => client.userId));
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        removeSocketId(socket);
        if (controllingSocketId === socket.id) {
            console.log('controlling user has disconnected');
            transferControl();
            io.sockets.to(controllingSocketId).emit('canControl', true);
        }
        socket.broadcast.emit('controllingUser', clientIds.find((client) => {
            if(client.socketId === controllingSocketId) {
                return client.userId;
            }
        }));
    });

    socket.on('identifier', (data) => {
        let genereatedId = generateId();
        if (data === 'client') {
            clientIds.push({ socketId: socket.id, userId: genereatedId });
            console.log(`client added to clientIds: ${clientIds}`);
            if (!controllingSocketId) {
                console.log('new controlling user', controllingSocketId);
                controllingSocketId = socket.id;
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
        socket.emit('controllingUser', clientIds.find((client) => {
            if(client.socketId === controllingSocketId) {
                return client.userId;
            }
        }));
    });

    socket.on('transferControl', (data) => {
        clientIds.forEach((client) => {
            if (client.userId === data) {
                controllingSocketId = client.socketId;
                console.log(`new controllingSocketId == ${controllingSocketId}`);
            }
        });
        socket.broadcast.emit('controllingUser', data);
    });

    socket.on('transferControl', (data) => {
        console.log(`transferring control to ${data}`);
        transferControl(data);
    });

    socket.on('controlsInput', (data) => {
        // console.log(data);
        console.log(`socket.id == ${socket.id}`);
        console.log(`controllingSocketId == ${controllingSocketId}`);
        if (socket.id === controllingSocketId) {
            socket.broadcast.emit('controlsOutput', data);
            console.log('Sending controls to pi');
        }
    });

    socket.on('carConnected', (data) => {
        socket.broadcast.emit('carConnected', data);
        console.log('sending car connection info to browser client');
    });

    socket.on('cameraConn', (data) => {
        console.log('pi camera connected');
    });

    socket.on('newDistance', (data) => {
        socket.broadcast.emit('newDistance', data);
    });

    // playback controls
    socket.on('playbackControls', (data) => {
        console.log('sending playback controls to pi');
        socket.broadcast.emit('playbackControls', data);
    });

    socket.on('controlRecording', (data) => {
        console.log('sending record start or stop request to pi');
        socket.broadcast.emit('controlRecording', data);
    });

    socket.on('playbackComplete', () => {
        socket.broadcast.emit('playbackComplete');
    });
    // end of playback controls

    socket.on('frame', (data) => {
        socket.broadcast.emit('frame', data);
    });
})
