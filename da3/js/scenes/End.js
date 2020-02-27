'use strict';

class End extends Phaser.Scene {
    constructor() {
        super("end");
    }

    create() {
        this.background = this.add.image(0, 0, "titleBackground");
        this.background.setOrigin(0, 0);

        // Bitmap texts
        this.add.bitmapText(6, config.height-24, "myFont", "Made by David Mark McMasters", 16);
        if (cond == 0) {
            this.add.bitmapText((config.width/2)-100, (config.height/2)-24, "myFont", "You Lost", 32);
        }
        else {
            this.add.bitmapText((config.width/2)-100, (config.height/2)-24, "myFont", "You Won", 32);
        }
        this.time.addEvent({
            delay: 2500,
            callback: () => {location.reload();},
            callbackScope: this,
            loop: false
        });  
    }
}