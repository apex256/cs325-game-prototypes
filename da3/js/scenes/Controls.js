'use strict';

class Controls extends Phaser.Scene {
    constructor() {
        super("controls");
    }

    create() {
        this.background = this.add.image(0, 0, "titleBackground");
        this.background.setOrigin(0, 0);

        // Bitmap texts
        this.add.bitmapText(6, config.height-24, "myFont", "Made by David Mark McMasters", 16);
        this.add.bitmapText((config.width/2)-280, (config.height/2)-24, "myFont", "Move: Left and Right arrows", 32);
        this.add.bitmapText((config.width/2)-100, (config.height/2)+24, "myFont", "Shoot: Z", 32);
        this.add.bitmapText((config.width/2)-160, (config.height/2)+64, "myFont", "Jump: Spacebar", 32);

        // Back button
        this.backText = this.add.bitmapText((config.width/2)-50, (config.height/2)+160, "myFont", "Back", 32);
        this.backText.setInteractive({ useHandCursor: true });
        this.backText.on("pointerover", () => {this.backText.setTint(0xFF0000);});
        this.backText.on("pointerout", () => {this.backText.clearTint();});
        this.backText.on("pointerdown", () => {this.scene.start("title");});
    }
}