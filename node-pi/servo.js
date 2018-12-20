const gpio = require('onoff').Gpio;
const led = new gpio(13, 'out');
const raspi = require('raspi');
const pwm = require('raspi-pwn');

raspi.init(() => {
  
}

setInterval(() => {
  setTimeout(() => led.writeSync(1),2);
  led.writeSync(0);
}, 20);               
