const gpio = require('onoff').Gpio;

const ma = new gpio(4, 'out');
const pwma = new gpio(17, 'out');

function forward() {
  ma.writeSync(0);
  pwma.writeSync(1);
}

function reverse() {
  pwma.writeSync(1);
  ma.writeSync(1);
}



function stop() {
  pwma.writeSync(0);
  ma.writeSync(0);
}
let on = false;
//setInterval(() => {
//  if(on) {
//    reverse();
//    on = !on;
//  } else {
//    forward();
//    on = !on;
//  }
//}, 1000);
//setInterval(() => forward(), 0.5);
//reverse();
//forward();
stop();
