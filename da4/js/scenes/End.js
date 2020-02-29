'use strict';

export class End extends Phaser.Scene {
    constructor() {
        super('End');
    }

    create() {
        let background = this.add.image(0, 0, 'titleBackground').setOrigin(0, 0);

        // Bitmap texts
        this.add.bitmapText(6, config.height-24, 'myFont', 'Made by David Mark McMasters', 16);

        let endText;
        if (cond == 0) 
            endText = 'Lost';
        else
            endText = 'Won';

        this.add.bitmapText((config.width/2)-100, (config.height/2)-24, 'myFont', 'You ' + endText + '!', 32).setOrigin(0.5);

        this.time.addEvent({
            delay: 2500,
            callback: () => {location.reload();},
            callbackScope: this,
            loop: false
        });  
    }
}