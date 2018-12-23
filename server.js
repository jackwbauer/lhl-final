const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ss = require('socket.io-stream');

const port = process.env.PORT || 3000;

app.use(express.static('public'));

server.listen(port, () => {
    console.log(`socket.io server listening on port ${port}`);
});

app.get('/', (request, response) => {
    response.redirect('./public/index.html');
});

io.on('connection', (socket) => {
    console.log('Connection established');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    })

    socket.on('controlsInput', (data) => {
        console.log(data);
        socket.broadcast.emit('controlsOutput', data);
        console.log('Sending controls to pi');
    });

    socket.on('carConnected', (data) => {
    //   console.log(data);
      socket.broadcast.emit('carConnected', data);
      console.log('sending car connection info to browser client');
    });

    socket.on('newDistance', (data) => {
    //   console.log(data);
      socket.broadcast.emit('newDistance', data);
    //   console.log('sending distance info to browser client');
    });

    let outgoingStream = ss.createStream();
    ss(socket).emit('videoStreamToBrowser', outgoingStream);

    ss(socket).on('videoStream', (stream, data) => {
        console.log('Receiving video stream');
        console.log(data);
        stream.pipe(outgoingStream);
    })
})
