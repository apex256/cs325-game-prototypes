'use strict';

// Imports
import { gameSettings } from '../index.js';
import { lineLength } from '../index.js';
import { Bullet } from '../objects/Bullet.js';
import { Player } from '../objects/Player.js';
import { pickSpawn } from '../index.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Socket Logic for players
        let self = this;
        this.socket = io();
        // Other players group
        this.otherPlayers = this.physics.add.group();
        this.socket.on('currentPlayers', (players) => {
            Object.keys(players).forEach( (id) => {
                if (players[id].id === self.socket.id) {
                    this.addPlayer(self, players[id]);
                }
                else {
                    this.addOtherPlayers(self, players[id]);
                }
            });
        });

        // New player connecting
        this.socket.on('newPlayer', (playerInfo) => {
            this.addOtherPlayers(self, playerInfo);
        });

        // Player disconnecting
        this.socket.on('disconnect', (id) => {
            self.otherPlayers.getChildren().forEach( (otherPlayer) => {
                if (id === otherPlayer.id) {
                    otherPlayer.destroy();
                }
            });
        });

        // Other player movement
        this.socket.on('playerMoved', (playerInfo) => {
            self.otherPlayers.getChildren().forEach( (otherPlayer) => {
                if (playerInfo.id === otherPlayer.id) {
                    otherPlayer.setRotation(playerInfo.rotation);
                    otherPlayer.setPosition(playerInfo.x, playerInfo.y);
                }
            });
        });

        // Tilemap
        this.map = this.add.tilemap('map');
        let terrain = this.map.addTilesetImage('textures', 'terrain');

        // Tilemap layers
        this.map.createStaticLayer('ground', [terrain], 0, 0);
        let wallsLayer = this.map.createStaticLayer('walls', [terrain], 0, 0);

        // Physics groups
        this.players = this.physics.add.group({
            classType: Player,
            maxSize: 8,
            runChildUpdate: true
        });
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true
        });

        // Physics
        wallsLayer.setCollisionByProperty({collide: true});
        this.physics.add.collider(this.players, wallsLayer);
        this.physics.add.collider(this.bullets, wallsLayer, (bullet) => { bullet.onHitHandler() });
        this.physics.add.overlap(this.bullets, this.players, this.bulletPlayerCollider.bind(this));

        // Audio
        this.bulletSmallAudio = this.sound.add('bullet_small_audio');

        // Input listeners
        this.input.mouse.capture = true;
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.sprintKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // World Bounds
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        // On-click event handler
        this.input.on('pointerdown', (function (pointer) {
            this.fireWeapon();
        }).bind(this));

        // TIMER TEMPLATE (REMOVE WHEN DONE)
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                console.log('One second has passed...');
            },
            callbackScope: this,
            loop: true,
            paused: false
        });
    }

    update() {
        if (this.player) {
            this.playerMovementManager();
            this.ccManager();

            // Emitting player movement
            let x = this.player.x;
            let y = this.player.y;
            let r = this.player.r;
            if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y || r !== this.player.oldPosition.rotation)) {
                this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y, rotation: this.player.rotation });
            }

            // Saving old player position data
            this.player.oldPosition = {
                x: this.player.x,
                y: this.player.y,
                rotation: this.player.rotation
            };
        }
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
        // This is for rotational debugging
        this.debugAimLineUpdate();

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

    // Player firing a weapon
    fireWeapon() {
        this.bulletSmallAudio.play();
        let bullet = this.bullets.get();
        if (bullet) {
            bullet.setDepth(3);
            bullet.fire(this.player);
        }
    }

    // Bullet collider
    bulletPlayerCollider(bullet, target) {
        if (target.id != this.player.id) {
            target.onHitHandler(bullet.type);
            bullet.onHitHandler();
        }
    }

    // Function for adding the current player
    addPlayer(self, playerInfo) {
        self.player = new Player(this, playerInfo.id, {x: playerInfo.x, y: playerInfo.y}, playerInfo.color);
        self.player.setCollideWorldBounds(true);

        // Crosshair
        this.crosshair = this.add.sprite(0, 0, 'crosshair').setOrigin(0.5);

        // Aiming debug tools
        self.debug_aimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0x00FF00).setOrigin(0);
        self.debug_xAimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0x0000FF).setOrigin(0);
        self.debug_yAimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0x0000FF).setOrigin(0);
        self.debug_opAimLine = this.add.line(this.player.x, this.player.y, 0, 0, 0, 0, 0xFF0000).setOrigin(0);

        // Camera and Mouse initialization
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player, true, 1.00, 1.00);
        this.mousePos = this.camera.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
    }

    // Function for adding other players (possible bug?)
    addOtherPlayers(self, playerInfo) {
        const otherPlayer = new Player(this, playerInfo.id, {x: playerInfo.x, y: playerInfo.y}, playerInfo.color);
        otherPlayer.id = playerInfo.id;
        self.otherPlayers.add(otherPlayer);
    }
}