const WebSocket = require('ws');

const ws = new WebSocket('ws://rpi-lhl-final.herokuapp.com/');

ws.on('open', () => {
    console.log('connected to websocket server');
});
