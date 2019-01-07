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
    if(!userId) {
        controllingSocketId = clientIds[0].socketId;
    } else {
        let socketId = clientIds.find((client) => {
            if (client.userId === userId) {
                return client.socketId;
            }
        });
        controllingSocketId = socketId ? socketId : '';
    }
}

function removeSocketId(socket) {
    if(controllingSocketId === socket.id) {
        transferControl();
        io.sockets.to(controllingSocketId).emit('canControl', true);
    }
    clientIds = clientIds.filter((element) => element.socketId !== socket.id);
}

io.on('connection', (socket) => {
    console.log('Connection established');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        removeSocketId(socket);
    });

    socket.on('identifier', (data) => {
        let genereatedId = generateId();
        if (data === 'client') {
            clientIds.push({ socketId: socket.id, userId: genereatedId });
            if (!controllingSocketId) {
                controllingSocketId = socket.id;
                socket.emit('canControl', true);
            } else {
                socket.emit('canControl', false);
            }
        } else if (data === 'car') {
            carIds.push({ socketId: socket.id, userId: genereatedId });
        }
        socket.emit('userId', genereatedId);
    })

    socket.on('controlsInput', (data) => {
        console.log(data);
        if (socket.id === controllingSocketId) {
            socket.broadcast.emit('controlsOutput', data);
        }
        console.log('Sending controls to pi');
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
        console.log('sending frame');
        socket.broadcast.emit('frame', data);
    });
})
