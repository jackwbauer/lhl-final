const WebSocket = require('ws');
const GPIO = require('onoff').Gpio;
const LED_red = new GPIO(13, 'out');
const LED_green = new GPIO(6, 'out');
const LED_blur = new GPIO(5, 'out');

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
   // console.log(JSON.parse(data));
  const controls = JSON.parse(data);  
  let direction = controls.direction;
  console.log(direction);
    if(direction > 0) {
        LED_red.writeSync(0);
      LED_blur.writeSync(1);
        LED_green.writeSync(1);
    } else if (direction < 0) {
        LED_green.writeSync(0);
      LED_blur.writeSync(0);
        LED_red.writeSync(1);
    } else {
        LED_green.writeSync(0);
        LED_red.writeSync(0);
      LED_blur.writeSync(1);
    }
});

