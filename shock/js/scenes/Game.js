'use strict';

import { gameSettings } from '../index.js';
import { isBetween } from '../index.js';
import { Ghost } from '../objects/Ghost.js';
import { TextButton } from '../objects/TextButton.js';
import { Block } from '../objects/Block.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.setupPhase = true;
        this.maxBlocks = 10;
    }

    create() {
        // Tilemap
        this.map = this.add.tilemap('map');
        let terrain = this.map.addTilesetImage('spritesheet', 'terrain');

        // Tilemap layers and sky
        this.add.image(0, 0, 'sky').setOrigin(0).setDisplaySize(this.map.widthInPixels, this.map.heightInPixels);
        let groundLayer = this.map.createStaticLayer('ground', [terrain], 0, 0);
        let backgroundLayer = this.map.createStaticLayer('background', [terrain], 0, 0);

        // Player
        this.player = this.physics.add.sprite(400, 1000, 'player');
        this.player.setActive(true);
        this.facing = 'right';
        this.player.setCollideWorldBounds(true);

        // Grid and Arrow
        this.arrow = this.add.image(0, 0, 'arrow');
        this.arrow.setDepth(2);

        // Groups
        this.blocks = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.ghosts = this.physics.add.group({
            allowGravity: false,
        });

        // Physics
        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.ghosts, groundLayer);
        this.physics.add.collider(this.blocks, this.player);
        this.physics.add.collider(this.blocks, this.ghosts, this.ghostBlockCollide);
        groundLayer.setCollisionByProperty({collide: true});

        // Input listeners
        this.input.mouse.capture = true;
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.altKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Camera Initialization
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player, true, 1.00, 1.00);
        this.cameraPos = this.camera.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);

        // Audio
        this.woodPlaceSound = this.sound.add('wood_place');
        this.woodBreakSound = this.sound.add('wood_break');
        this.winSound = this.sound.add('victory');
        this.buttonSound = this.sound.add('button');

        // Bounds
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Block placing event handler
        this.input.on('pointerdown', (function (pointer) {
            if (this.setupPhase)
                this.onClickEventHandler();
        }).bind(this));

        // Setup timer
        this.setupTimer = this.time.addEvent({
            delay: 60000,
            callback: function() {
                this.setupPhase = false;
                this.startDefendPhase();
            },
            callbackScope: this,
            loop: false
        });

        // Defend timer
        this.defendTimer = this.time.addEvent({
            delay: 20000,
            callback: function() {
                this.winGame();
            },
            callbackScope: this,
            loop: false,
            paused: true
        });

        // Screen text
        this.blockText = this.add.bitmapText(this.camera.getWorldPoint(6, 6).x, this.camera.getWorldPoint(6, 6).y, 'myFont', 'Blocks Left: ' + this.maxBlocks, 16);
        this.setupTimerText = this.add.bitmapText(this.camera.getWorldPoint(6, 32).x, this.camera.getWorldPoint(6, 32).y, 'myFont', 'Time Remaining to setup: ' + this.setupTimer.getElapsedSeconds(), 16);
        this.defendTimerText = this.add.bitmapText(this.camera.getWorldPoint(6, 32).x, this.camera.getWorldPoint(6, 32).y, 'myFont', '', 16);

        // Overlaps
        this.physics.add.overlap(this.player, this.ghosts, this.loseGame, null, this);
    }

    update() {
        if (this.setupPhase) {
            this.playerMovementManager();
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.stop();
        }
        // Updating cameraPos and arrow
        if (this.setupPhase) {
            this.cameraPos = this.camera.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
            this.arrow.x = 80 * Math.floor(this.cameraPos.x/80) - 10;
            this.arrow.y = 80 * Math.floor(this.cameraPos.y/80) + 40;
        }

        // Updating text position
        this.blockText.setPosition(this.camera.getWorldPoint(6, 6).x, this.camera.getWorldPoint(6, 6).y);
        this.blockText.setText('Blocks Left: ' + this.maxBlocks);
        this.setupTimerText.setPosition(this.camera.getWorldPoint(6, 32).x, this.camera.getWorldPoint(6, 32).y);
        this.setupTimerText.setText('Time Remaining to setup: ' + (60 - this.setupTimer.getElapsedSeconds()).toFixed(2) + 's');
        this.defendTimerText.setPosition(this.camera.getWorldPoint(6, 32).x, this.camera.getWorldPoint(6, 32).y);
        if (this.setupPhase)
            this.defendTimerText.setText('');
        else
            this.defendTimerText.setText('Time Remaining to defend: ' + (20 - this.defendTimer.getElapsedSeconds()).toFixed(2) + 's');

        // Updating ghosts
        if (!this.setupPhase) {
            for (let i = 0; i < this.ghosts.getChildren().length; i++) {
                let ghost = this.ghosts.getChildren()[i];
                ghost.update();
            }
        }

        // Updating blocks
        for (let i = 0; i < this.blocks.getChildren().length; i++) {
            let block = this.blocks.getChildren()[i];
            block.update();
        }
    }

    // Player movement manager
    playerMovementManager() {
        if (this.cursorKeys.left.isDown) {
            this.facing = 'left';
            this.player.setVelocityX(-gameSettings.playerSpeed);
            this.player.anims.play('player_left', true);
        }
        else if (this.cursorKeys.right.isDown) {
            this.facing = 'right';
            this.player.setVelocityX(gameSettings.playerSpeed);
            this.player.anims.play('player_right', true);
        }
        else {
            this.player.setVelocityX(0);
            if (this.facing == 'left') {
                this.player.anims.play('player_left_idle', true);
            }
            else {
                this.player.anims.play('player_right_idle', true);
            }
        }

        // Jumping
        if (this.jumpKey.isDown && (this.player.body.onFloor() || this.player.body.touching.down)) {
            this.player.setVelocityY(gameSettings.playerJumpVelocity);
        }
    }

    // Event handler for clicking onto the map
    onClickEventHandler() {
        let x = (80 * (Math.floor(this.cameraPos.x/80)));
        let y = (80 * (Math.floor(this.cameraPos.y/80)));

        // Deleting block
        if (this.altKey.isDown) {
            for (let i = 0; i < this.blocks.getChildren().length; i++) {
                let checkBlock = this.blocks.getChildren()[i];
                if (isBetween(this.cameraPos.x, this.cameraPos.y, checkBlock.x, checkBlock.y, checkBlock.x+80, checkBlock.y+80)) {
                    checkBlock.destroy();
                    this.woodBreakSound.play();
                    this.maxBlocks++;
                    break;
                }
            }
        }
        // Placing block
        else if (this.maxBlocks > 0) {
            let isExisting = false;
            for (let i = 0; i < this.blocks.getChildren().length; i++) {
                let checkBlock = this.blocks.getChildren()[i];
                if (isBetween(this.cameraPos.x, this.cameraPos.y, checkBlock.x, checkBlock.y, checkBlock.x+80, checkBlock.y+80)) {
                    isExisting = true;
                    break;
                }
            }

            if (!isExisting) {
                this.spawnBlock(x, y);
                this.woodPlaceSound.play();
                this.maxBlocks--;
            }
        }
    }

    // Function for starting the defend phase
    startDefendPhase() {
        this.defendTimer.paused = false;
        this.setupTimerText.setVisible(false);
        this.arrow.destroy();
        for (let i = 0; i < 5; i++) {
            this.spawnGhost();
        }
    }

    // Function for spawning ghosts
    spawnGhost() {
        let ghost = new Ghost(this);
        ghost.setScale(2);
    }

    // Function for spawning blocks
    spawnBlock(x, y) {
        let block = new Block(this, x, y);
    }

    // Function for handling the ghost collision to the blocks
    ghostBlockCollide(block, ghost) {
        block.hp -= 0.1;
    }

    // Function for ending the game
    winGame() {
        this.sound.stopAll();
        this.physics.pause();
        this.winSound.play();
        this.add.bitmapText(this.camera.getWorldPoint(400, 300).x, this.camera.getWorldPoint(400, 300).y, 'myFont', 'Mission success!', 32).setOrigin(0.5);

        // Menu button
        let menuButton = new TextButton(
            this, this.camera.getWorldPoint(400, 376).x, this.camera.getWorldPoint(400, 376).y,
            'myFont',
            'Menu',
            32,
            () => {
                this.buttonSound.play();
                this.winSound.stop();
                location.reload();
            }
        ).setOrigin(0.5);
        this.add.existing(menuButton);
    }

    // Function for ending the game
    loseGame() {
        this.defendTimer.paused = true;
        this.sound.stopAll();
        this.physics.pause();
        this.add.bitmapText(this.camera.getWorldPoint(400, 300).x, this.camera.getWorldPoint(400, 300).y, 'myFont', 'Mission failed!', 32).setOrigin(0.5);

        // Menu button
        let menuButton = new TextButton(
            this, this.camera.getWorldPoint(400, 376).x, this.camera.getWorldPoint(400, 376).y,
            'myFont',
            'Menu',
            32,
            () => {
                this.buttonSound.play();
                this.winSound.stop();
                location.reload();
            }
        ).setOrigin(0.5);
        this.add.existing(menuButton);
    }
}