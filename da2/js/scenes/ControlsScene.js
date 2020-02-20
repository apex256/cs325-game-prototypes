'use strict';

let music;

class ControlsScene extends Phaser.Scene {
    constructor() {
        super("controls");
    }

    create() {
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);

        this.add.bitmapText(6, config.height-24, 'myFont', 'Made by David Mark McMasters', 16);

        music = this.sound.add('music');

        this.add.bitmapText((config.width/2)-240, (config.height/2)-16, 'myFont', 'Space: Fly, Arrows: Move', 32);
        this.add.bitmapText((config.width/2)-240, (config.height/2)+24, 'myFont', 'PRESS ENTER TO BEGIN', 32);

        // Inputs
        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        // Transition to next state on ENTER press
        if (this.startKey.isDown) this.startGame();
    }

    startGame() {
        this.scene.start("game");
        buttonSound.play();
        music.play( {loop: true} );
    }
}