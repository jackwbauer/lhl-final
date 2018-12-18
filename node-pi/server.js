const WebSocket = require('ws');
const GPIO = require('onoff').Gpio;
const LED = new GPIO(31, 'out');

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

LED.writeSync(1);
