const camera = require('./camera');
const ss = require('socket.io-stream');
const spawn = require('child_process').spawn;
const motor = require('./motor.js');
<<<<<<< HEAD
const five = require('johnny-five');
const PiIO = require('pi-io');
=======
const ultrasonic = require('./ultrasonic.js');
//const five = require('johnny-five');
//const Raspi = require('raspi-io');
//const PiIO = require('pi-io');
>>>>>>> ae36a2f6e90b65a419350849c804a2c837cabd20

console.log(ultrasonic);

const socket = require('socket.io-client')('ws://rpi-lhl-final.herokuapp.com');
const stream  = ss.createStream();
const child = spawn('/opt/vc/bin/raspivid', ['-hf', '-w', '1920', '-h', '1080', '-t', '0', '-fps', '24', '-b', '5000000', '-o', '-']);



socket.on('connect', () => {
    console.log('Connected web server');
    socket.emit('carConnected', { carId: 1 });
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
    //console.log(direction);
    if(turn > 0) {
<<<<<<< HEAD
      motor.right();
=======
      motor.right()
>>>>>>> ae36a2f6e90b65a419350849c804a2c837cabd20
    } else if (turn < 0) {
      motor.left();
    } else if (direction > 0) {
         motor.forward();
     } else if (direction < 0) {
         motor.reverse();
<<<<<<< HEAD
=======
     //} //else if (turn > 0) {
       //motor.right();
     //} else if (turn < 0) {
      // motor.left();
>>>>>>> ae36a2f6e90b65a419350849c804a2c837cabd20
     } else {
       motor.stop();
     }
});

<<<<<<< HEAD
const board =  new five.Board({io: new PiIO()});
board.on('ready', () => {
  const proximity = new five.Proximity({
    controller: PiIO.HCSR04,
    triggerPin: 'GPIO23',
    echoPin: 'GPIO24'
  });

  proximity.on('change', function() {
    console.log('cm: ', this.cm);
    if (this.cm <= 10) {
      motor.stop();
    }
    socket.emit('newDistance', { carId: 1, distance: this.cm });
  });
});
=======
//const board =  new five.Board({io: new PiIO()});
//board.on('ready', () => {
  //const proximity = new five.Proximity({
    //controller: 'HCSR04',
    //pin: 23
  //});

  //proximity.on('data', function() {
    //console.log('Proximity: ');
    //console.log('  cm:', this.cm);
    //console.log('  in:', this.in);
    //console.log('----------');
  //});

  //proximity.on('change', function() {
    //console.log('thie obstruction has moved.');
  //})
//});

//setInterval(() => {
  //ultrasonic.distance().then((distance) => {
    //console.log(distance);
  //})
//}, 500);
>>>>>>> ae36a2f6e90b65a419350849c804a2c837cabd20

