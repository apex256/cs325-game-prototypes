'use strict';

let startText;
let buttonSound;

class Scene2 extends Phaser.Scene {
    constructor() {
        super("title");
    }

    create() {
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);

        this.add.bitmapText(6, config.height-24, 'myFont', 'Made by David Mark McMasters', 16);

        startText = this.add.bitmapText((config.width/2)-240, (config.height/2)-16, 'myFont', 'PRESS ENTER TO BEGIN', 32);
        buttonSound = this.sound.add('press');

        // Text timer
        this.timer = this.time.addEvent({
            delay: 750,
            callback: function() {startText.visible = !startText.visible;},
            loop: true
        });

        // Inputs
        this.playKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        // Transition to next state on ENTER press
        if (this.playKey.isDown) this.startGame();
    }

    startGame() {
        this.scene.start("controls");
        buttonSound.play();
    }
}