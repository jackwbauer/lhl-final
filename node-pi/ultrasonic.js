const GPIO = require('onoff').Gpio;
const trigger = new GPIO(23, 'out');
const echo = new GPIO(24, 'in');
const MICROSECONDS_PER_CM = 1e6/34321;


let duration = 0.0;

// function loop() {
//     setTimeout(trigger.writeSync(0), 5);
//     setTimeout(trigger.writeSync(1), 10);
//     trigger.writeSync(0)
// }

echo.watch((err, value) => {
    console.log('watching');
    let startTick;
    let endTick;
    if(err) {
        console.error(err);
    }
    if(value == 1) {
        startTick = tick;
    } else {
        endTick = tick;
        diff = (endTick >> 0) - (startTick >> 0);
        console.log(diff / 2 / MICROSECONDS_PER_CM)
    }
})

setInterval(() => {
    setTimeout(() => trigger.writeSync(1), 10);
    trigger.writeSync(0)
})