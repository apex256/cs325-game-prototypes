'use strict';

import { config } from '../index.js'
import { TextButton } from '../objects/TextButton.js';

export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    // Getting whether this is the first instance for music player
    init(data) {
        this.first = data.firstInstance;
    }

    create() {
        this.add.image(0, 0, 'titleBackground').setOrigin(0, 0);

        // Bitmap texts
        this.add.bitmapText(6, config.height-24, 'myFont', 'Made by David Mark McMasters', 16);
        this.add.bitmapText((config.width/2), (config.height/2)-192, 'myFont', 'Carpenter Craft', 52).setOrigin(0.5);

        // Audio
        let buttonSound = this.sound.add('button');
        let music = this.sound.add('menuSong');
        if (this.first) {
            music.play( {loop: true} );
        }

        // Start Game button
        let startButton = new TextButton(
            this, config.width/2, (config.height/2)-24,
            'myFont',
            'Start Game',
            32,
            () => {
                buttonSound.play();
                // Starting Game scene
                this.scene.start('Game');
            }
        ).setOrigin(0.5);
        this.add.existing(startButton);

        // Start Game button
        let controlsButton = new TextButton(
            this, config.width/2, (config.height/2)+24,
            'myFont',
            'Controls',
            32,
            () => {
                buttonSound.play();
                // Starting Controls scene
                this.scene.start('Controls');
            }
        ).setOrigin(0.5);
        this.add.existing(controlsButton);
    }
}