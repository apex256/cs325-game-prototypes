'use strict';

import { gameSettings } from '../index.js';
import { lineLength } from '../index.js';
import { Bullet } from '../objects/Bullet.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Tilemap
        this.map = this.add.tilemap('map');
        let terrain = this.map.addTilesetImage('textures', 'terrain');

        // Tilemap layers
        let groundLayer = this.map.createStaticLayer('ground', [terrain], 0, 0);
        let wallsLayer = this.map.createStaticLayer('walls', [terrain], 0, 0);

        // Player and crosshair
        this.player = this.physics.add.sprite(128, 128, 'player').setOrigin(0.5);
        this.player.setActive(true);
        this.player.setCollideWorldBounds(true);
        this.crosshair = this.add.sprite(0, 0, 'crosshair').setOrigin(0.5);

        // Physics
        this.physics.add.collider(this.player, wallsLayer);
        wallsLayer.setCollisionByProperty({collide: true});

        // Input listeners
        this.input.mouse.capture = true;
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Camera / Mouse Initialization
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player, true, 1.00, 1.00);
        this.mousePos = this.camera.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);

        // World Bounds
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Physics groups
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true
        });
        
        // On-click event handler
        this.input.on('pointerdown', (function (pointer) {
            //this.onClickEventHandler();
        }).bind(this));

        // Aiming debugging tools
        this.debug_aimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0x00FF00).setOrigin(0);
        this.debug_xAimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0x0000FF).setOrigin(0);
        this.debug_yAimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0x0000FF).setOrigin(0);
        this.debug_opAimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0xFF0000).setOrigin(0);
    }

    update() {
        this.playerMovementManager();
        this.ccManager();
    }

    // Player movement manager
    playerMovementManager() {
        // W Key
        if (this.upKey.isDown) {
            this.player.setVelocityY(-gameSettings.playerSpeed);
            this.player.setVelocityX(0);
        }
        // S Key
        else if (this.downKey.isDown) {
            this.player.setVelocityY(gameSettings.playerSpeed);
            this.player.setVelocityX(0);
        }
        // A Key
        else if (this.leftKey.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
            this.player.setVelocityY(0);
        }
        // D Key
        else if (this.rightKey.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
            this.player.setVelocityY(0);
        }
        // Not moving
        else {
            this.player.setVelocity(0);
        }
    }

    // Camera and Crosshair Manager
    ccManager() {
        this.mousePos = this.camera.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
        //this.debugAimLineUpdate();

        // Calculating the angle and checking which quadrant the mouse is relative to player
        let cameraAngle = Math.asin(lineLength(this.mousePos.x-this.player.x, 0, this.mousePos.x-this.player.x, this.mousePos.y-this.player.y)/(lineLength(0, 0, this.mousePos.x-this.player.x, this.mousePos.y-this.player.y)));
        if (this.mousePos.x >= this.player.x && this.mousePos.y <= this.player.y) {
            this.player.setRotation(-(cameraAngle - (Math.PI/2)));
        }
        else if (this.mousePos.x <= this.player.x && this.mousePos.y <= this.player.y) {
            this.player.setRotation(-(Math.PI - cameraAngle - (Math.PI/2)));
        }
        else if (this.mousePos.x <= this.player.x && this.mousePos.y >= this.player.y) {
            this.player.setRotation(-(Math.PI + cameraAngle - (Math.PI/2)));
        }
        else {
            this.player.setRotation(-((2 * Math.PI) - cameraAngle - (Math.PI/2)));
        }

        // Tracking the crosshair with the mouse
        this.crosshair.x = this.mousePos.x;
        this.crosshair.y = this.mousePos.y;

    }

    // Debug aim lines
    debugAimLineUpdate() {
        this.debug_aimLine.x = this.player.x;
        this.debug_aimLine.y = this.player.y;
        this.debug_xAimLine.x = this.player.x;
        this.debug_xAimLine.y = this.player.y;
        this.debug_yAimLine.x = this.player.x;
        this.debug_yAimLine.y = this.player.y;
        this.debug_opAimLine.x = this.player.x;
        this.debug_opAimLine.y = this.player.y;
        this.debug_aimLine.setTo(0, 0, this.mousePos.x-this.player.x, this.mousePos.y-this.player.y);
        this.debug_xAimLine.setTo(-64, 0, 64, 0);
        this.debug_yAimLine.setTo(0, -64, 0, 64);
        this.debug_opAimLine.setTo(this.mousePos.x-this.player.x, 0, this.mousePos.x-this.player.x, this.mousePos.y-this.player.y);
    }
}