const WebSocket = require('ws');

const host = 'ws://rpi-lhl-final.herokuapp.com/';
let ws = new WebSocket(host);

ws.on('open', () => {
    console.log('connected to websocket server');
});

ws.on('close', () => {
    setTimeout(() => {
        ws = new WebSocket(host);
    }, 500);
});

ws.on('message', (data) => {
    console.log(JSON.parse(data));
});
