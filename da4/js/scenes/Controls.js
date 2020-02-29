'use strict';

import { config } from '../index.js';
import { TextButton } from '../objects/TextButton.js';

export class Controls extends Phaser.Scene {
    constructor() {
        super('Controls');
    }

    create() {
        let background = this.add.image(0, 0, 'titleBackground').setOrigin(0, 0);

        // Bitmap texts
        this.add.bitmapText(6, config.height-24, 'myFont', 'Made by David Mark McMasters', 16);
        this.add.bitmapText((config.width/2), (config.height/2)-112, 'myFont', 'Move: Left and Right arrows', 32).setOrigin(0.5);
        this.add.bitmapText((config.width/2), (config.height/2)-64, 'myFont', 'Attack: Z', 32).setOrigin(0.5);
        this.add.bitmapText((config.width/2), (config.height/2)-16, 'myFont', 'Place Block: X', 32).setOrigin(0.5);
        this.add.bitmapText((config.width/2), (config.height/2)+32, 'myFont', 'Jump: Spacebar', 32).setOrigin(0.5);

        // Back button
        let backButton = new TextButton(
            this, config.width/2, (config.height/2)+208,
            'myFont',
            'Back',
            32,
            () => {
                this.scene.start('Menu');
            }
        ).setOrigin(0.5);
        this.add.existing(backButton);
    }
}