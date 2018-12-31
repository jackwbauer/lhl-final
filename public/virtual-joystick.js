/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link http://choosealicense.com/licenses/no-license/|No License}
* 
* @description  This example requires the Phaser Virtual Joystick Plugin to run.
*               For more details please see http://phaser.io/shop/plugins/virtualjoystick
*/

// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'videoStream');

var PhaserGame = function () {

    this.sprite;

    this.pad;

    this.stick;

    this.buttonA;
    this.buttonB;
    this.buttonC;

};

PhaserGame.prototype = {

    init: function () {

        // this.game.renderer.renderSession.roundPixels = true;
        // this.physics.startSystem(Phaser.Physics.ARCADE);

    },

    preload: function () {

        this.load.atlas('dpad', 'phaser/skins/dpad.png', 'phaser/skins/dpad.json');

    },

    create: function () {
        this.pad = this.game.plugins.add(Phaser.VirtualJoystick);
        this.stick = this.pad.addDPad(0, 0, 200, 'dpad');
        this.stick.alignBottomLeft(0);
    },

    update: function () {

        if (this.stick.isDown) {
            if (this.stick.direction === Phaser.LEFT) {
                document.getElementById('turn').innerHTML = `turn = -1`;
                document.getElementById('direction').innerHTML = `direction = 0`;
            }
            else if (this.stick.direction === Phaser.RIGHT) {
                document.getElementById('turn').innerHTML = `turn = 1`;
                document.getElementById('direction').innerHTML = `direction = 0`;
            }
            else if (this.stick.direction === Phaser.UP) {
                document.getElementById('direction').innerHTML = `direction = 1`;
                document.getElementById('turn').innerHTML = `turn = 0`;
            }
            else if (this.stick.direction === Phaser.DOWN) {
                document.getElementById('direction').innerHTML = `direction = -1`;
                document.getElementById('turn').innerHTML = `turn = 0`;
            }
        }
        else {
            document.getElementById('direction').innerHTML = `direction = 0`;
            document.getElementById('turn').innerHTML = `turn = 0`;
        }

    }

};

game.state.add('Game', PhaserGame, true);
