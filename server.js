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

io.on('connection', (socket) => {
    console.log('Connection established');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    })

    socket.on('controlsInput', (data) => {
        console.log(data);
        socket.broadcast.emit('controlsOutput', data);
        console.log('Sending controls to pi');
    })
})