const camera = require('./camera');
const ss = require('socket.io-stream');
const spawn = require('child_process').spawn;
// const GPIO = require('onoff').Gpio;
// const LED_red = new GPIO(13, 'out');
// const LED_green = new GPIO(6, 'out');
// const LED_blur = new GPIO(5, 'out');

const socket = require('socket.io-client')('ws://rpi-lhl-final.herokuapp.com');
const stream  = ss.createStream();
const child = spawn('/opt/vc/bin/raspivid', ['-hf', '-w', '1920', '-h', '1080', '-t', '0', '-fps', '24', '-b', '5000000', '-o', '-']);



socket.on('connect', () => {
    console.log('Connected web server');
})

socket.on('disconnect', () => {
    console.log('Disconnected from web server');
})

ss(socket).emit('videoStream', stream);
// child.stdout.pipe(stream);
stream.pipe(child.stdout);

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