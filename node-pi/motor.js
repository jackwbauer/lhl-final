const gpio = require('onoff').Gpio;

const ma = new gpio(4, 'out');
const pwma = new gpio(17, 'out');
const mb = new gpio(27, 'out');
//const pwmb = new gpio(22, 'out');

//pwma.writeSync(1)

exports.forward = function() {
  pwma.writeSync(1);
  //pwmb.writeSync(1);
  ma.writeSync(1);
  mb.writeSync(1);
}

exports.reverse = function() {
  pwma.writeSync(1);
  //pwmb.writeSync(1);
  ma.writeSync(0);
  mb.writeSync(0);
}

exports.right = function() {
  pwma.writeSync(1);
  //pwmb.writeSync(1);
  ma.writeSync(1);
  mb.writeSync(0);
}

exports.left = function() {
  pwma.writeSync(1);
  //pwmb.writeSync(1);
  ma.writeSync(0);
  mb.writeSync(1);
}

exports.stop = function() {
  pwma.writeSync(0);
  //pwmb.writeSync(0);
  ma.writeSync(0);
  mb.writeSync(0);
}
