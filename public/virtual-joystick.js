/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link http://choosealicense.com/licenses/no-license/|No License}
* 
* @description  This example requires the Phaser Virtual Joystick Plugin to run.
*               For more details please see http://phaser.io/shop/plugins/virtualjoystick
*/

// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example');

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

        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);

    },

    preload: function () {

        this.load.atlas('dpad', './phaser/skins/dpad.png', './phaser/skins/dpad.json');
        this.load.image('ball', './phaser/bubble.png');
        this.load.image('bg', './phaser/space2.png');

    },

    create: function () {

        this.add.image(0, 0, 'bg');

        this.sprite = this.add.sprite(400, 200, 'ball');
        this.physics.arcade.enable(this.sprite);

        this.pad = this.game.plugins.add(Phaser.VirtualJoystick);

        this.stick = this.pad.addDpad(0, 0, 200, 'arcade');
        this.stick.alignBottomLeft(100);
        //this.stick.posx = 100;
        //this.stick.posy = 100;

        this.buttonA = this.pad.addButton(500, 520, 'dpad', 'button1-up', 'button1-down');
        this.buttonA.onDown.add(this.pressButtonA, this);

        this.buttonB = this.pad.addButton(615, 450, 'dpad', 'button2-up', 'button2-down');
        this.buttonB.onDown.add(this.pressButtonB, this);

        this.buttonC = this.pad.addButton(730, 520, 'dpad', 'button3-up', 'button3-down');
        this.buttonC.onDown.add(this.pressButtonC, this);

    },

    pressButtonA: function () {

        this.sprite.tint = Math.random() * 0xFFFFFF;

    },

    pressButtonB: function () {

        this.sprite.scale.set(Math.random() * 4);

    },

    pressButtonC: function () {

        this.sprite.scale.set(1);
        this.sprite.tint = 0xFFFFFF;

    },

    update: function () {

        var maxSpeed = 300;

        if (this.stick.isDown)
        {
            this.sprite.body.velocity.set(0);

            if (this.stick.direction === Phaser.LEFT)
            {
                this.sprite.body.velocity.x = -maxSpeed;
            }
            else if (this.stick.direction === Phaser.RIGHT)
            {
                this.sprite.body.velocity.x = maxSpeed;
            }
            else if (this.stick.direction === Phaser.UP)
            {
                this.sprite.body.velocity.y = -maxSpeed;
            }
            else if (this.stick.direction === Phaser.DOWN)
            {
                this.sprite.body.velocity.y = maxSpeed;
            }
        }
        else
        {
            this.sprite.body.velocity.set(0);
        }

    }

};
console.log(game);

game.state.add('Game', PhaserGame, true);