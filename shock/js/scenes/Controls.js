'use strict';

import { config } from '../index.js';
import { TextButton } from '../objects/TextButton.js';

export class Controls extends Phaser.Scene {
    constructor() {
        super('Controls');
    }

    create() {
        this.add.image(0, 0, 'titleBackground').setOrigin(0, 0);

        // Bitmap texts
        this.add.bitmapText(6, config.height-24, 'myFont', 'Made by David Mark McMasters', 16);
        this.add.bitmapText((config.width/2), (config.height/2)-112, 'myFont', 'Move: Left and Right arrows', 32).setOrigin(0.5);
        this.add.bitmapText((config.width/2), (config.height/2)-64, 'myFont', 'Place Block: Left-Click', 32).setOrigin(0.5);
        this.add.bitmapText((config.width/2), (config.height/2)-16, 'myFont', 'Remove Block: Left-Click + Shift', 32).setOrigin(0.5);
        this.add.bitmapText((config.width/2), (config.height/2)+32, 'myFont', 'Jump: Spacebar', 32).setOrigin(0.5);

        // Sound
        let buttonSound = this.sound.add('button');

        // Back button
        let backButton = new TextButton(
            this, config.width/2, (config.height/2)+208,
            'myFont',
            'Back',
            32,
            () => {
                buttonSound.play();
                this.scene.start('Menu', { firstInstance: false });
            }
        ).setOrigin(0.5);
        this.add.existing(backButton);
    }
}