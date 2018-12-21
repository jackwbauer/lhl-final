const camera = require('./camera');
const raspivid = require('raspivid');
const ss = require('socket.io-stream');
const spawn = require('child_process').spawn;
const motor = require('./motor.js');
//const ultrasonic = require('./ultrasonic.js');
const five = require('johnny-five');
const Raspi = require('raspi-io');

const socket = require('socket.io-client')('ws://rpi-lhl-final.herokuapp.com');
// const stream  = ss.createStream();
// const child = spawn('/opt/vc/bin/raspivid', ['-hf', '-w', '1920', '-h', '1080', '-t', '0', '-fps', '24', '-b', '5000000', '-o', '-']);

socket.on('connect', () => {
    console.log('Connected web server');
})

//const video = raspivid();

socket.on('disconnect', () => {
    console.log('Disconnected from web server');
})

//ss(socket).emit('videoStream', stream);
//video.pipe(stream);

socket.on('controlsOutput', (data) => {
    console.log('Received controls');
    console.log(data);
    const controls = data;
    let direction = controls.direction;
    let turn = controls.turn;
    console.log(direction);
     if (direction > 0) {
         motor.forward();
     } else if (direction < 0) {
         motor.reverse();
     } else if (turn > 0) {
       motor.right();
     } else if (turn < 0) {
       motor.left();
     } else {
       motor.stop();
     }
})

//const board =  new five.Board({io: new Raspi()});
//board.on('ready', () => {
//  const proximity = new five.Proximity({
//    controller: 'HCSR04',
//    pin: 23
//  });

//  proximity.on('data', function() {
//    console.log('Proximity: ');
//    console.log('  cm:', this.cm);
//    console.log('  in:', this.in);
//    console.log('----------');
//  });

//  proximity.on('change', function() {
//    console.log('thie obstruction has moved.');
//  })
//});

//setInterval(() => {
//  ultrasonic.distance().then((distance) => {
//    console.log(distance);
//  })
//}, 500);
