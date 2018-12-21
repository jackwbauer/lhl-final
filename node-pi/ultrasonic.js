const GPIO = require('onoff').Gpio;
const trigger = new GPIO(23, 'out');
const echo = new GPIO(24, 'in');
const MICROSECONDS_PER_CM = 1e6/34321;
const { delay } = require('bluebird');

let duration = 0.0;

// function loop() {
//     setTimeout(trigger.writeSync(0), 5);
//     setTimeout(trigger.writeSync(1), 10);
//     trigger.writeSync(0)
// }

exports.distance = async function() {
  let startTick = 0;
  let endTick = 0;
  let distance = 0.0;

  await delay(300);
  
  trigger.writeSync(1);

  await delay(0.1);

  trigger.writeSync(0);

  while(!echo.readSync()) {
    startTick = new Date().getTime();
  }
  
  while(echo.readSync()) {
    endTick = new Date().getTime();
  }

  duration = endTick - startTick;
  distance = duration / 2 / MICROSECONDS_PER_CM;
  return distance;
}
