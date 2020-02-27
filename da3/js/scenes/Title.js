'use strict';

class Title extends Phaser.Scene {
    constructor() {
        super("title");
    }

    create() {
        this.background = this.add.image(0, 0, "titleBackground");
        this.background.setOrigin(0, 0);

        // Bitmap texts
        this.add.bitmapText(6, config.height-24, "myFont", "Made by David Mark McMasters", 16);
        this.add.bitmapText((config.width/2)-350, (config.height/2)-192, "myFont", "The Last Laundromat", 52);
        this.startText = this.add.bitmapText((config.width/2)-80, (config.height/2)-24, "myFont", "Start Game", 32);
        this.controlsText = this.add.bitmapText((config.width/2)-60, (config.height/2)+24, "myFont", "Controls", 32);

        // Menu navigation
        this.startText.setInteractive({ useHandCursor: true });
        this.controlsText.setInteractive({ useHandCursor: true });
        this.startText.on("pointerover", () => {this.startText.setTint(0xFF0000);});
        this.startText.on("pointerout", () => {this.startText.clearTint();});
        this.controlsText.on("pointerover", () => {this.controlsText.setTint(0xFF0000);});
        this.controlsText.on("pointerout", () => {this.controlsText.clearTint();});
        this.startText.on("pointerdown", () => {this.scene.start("level1"); buttonSound.play()});
        this.controlsText.on("pointerdown", () => {this.scene.start("controls"); buttonSound.play()});
    }
}