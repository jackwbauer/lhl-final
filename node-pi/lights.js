const gpio = require('onoff').Gpio;
const led = new gpio(13, 'out');

let on = false;

setInterval(() => {
  console.log(on);
  on ? led.writeSync(1) : led.writeSync(0);
  on = !on;
}, 2000)
