const PiCamera = require('pi-camera');
const camera = new PiCamera({
    mode: 'photo',
    output: `${ __dirname }/test.jgp`,
    width: 1920,
    height: 1080,
    nopreview: false
});

//camera.snap();
module.exports = camera;
