const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

const server = express()
    .use(express.static('public'))
    .listen(PORT, () => {
        console.log(`websocket server listening on port ${PORT}`);
    });

const wss = new WebSocket.Server({ server });

app.get('/', (request, response) => {
    response.redirect('./public/index.html');
});

wss.on('connection', (ws) => {
    console.log('Connection established');

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('message', (data) => {
        const message = JSON.parse(data);
        console.log(message);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('did this work?');
                console.log('sending message to clients');
            }
        });
    });

});
