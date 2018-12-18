const camera = require('./camera');
// const GPIO = require('onoff').Gpio;
// const LED_red = new GPIO(13, 'out');
// const LED_green = new GPIO(6, 'out');
// const LED_blur = new GPIO(5, 'out');
const socket = require('socket.io-client')('rpi-lhl-final.herokuapp.com');

socket.on('connect', () => {
    console.log('Connected web server');
})

socket.on('disconnect', () => {
    console.log('Disconnected from web server');
})

socket.on('controlsOutput', (data) => {
    console.log('Received controls');
    console.log(data);
    // const controls = JSON.parse(data);
    // let direction = controls.direction;
    //console.log(direction);
    // if (direction > 0) {
    //     LED_red.writeSync(0);
    //     LED_blur.writeSync(0);
    //     LED_green.writeSync(1);
    // } else if (direction < 0) {
    //     LED_green.writeSync(0);
    //     LED_blur.writeSync(0);
    //     LED_red.writeSync(1);
    // } else {
    //     LED_green.writeSync(0);
    //     LED_red.writeSync(0);
    //     LED_blur.writeSync(1);
    // }
})