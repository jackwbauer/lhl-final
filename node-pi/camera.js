const PiCamera = require('pi-camera');
const camera = new PiCamera({
    mode: 'video',
    output: `${ __dirname }/videos/test.h264`,
    width: 1920,
    height: 1080,
    timeout: 3000,
    nopreview: false
});

//camera.snap();
module.exports = camera;
