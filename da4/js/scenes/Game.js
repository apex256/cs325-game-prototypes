'use strict';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Tilemap
        let map = this.add.tilemap('map');
        let terrain = map.addTilesetImage('spritesheet', 'terrain');

        // Tilemap layers and sky
        this.add.tileSprite(0, 0, map.heightInPixels, map.widthInPixels, 'sky');
        let groundLayer = map.createStaticLayer('ground', [terrain], 0, 0);
        let backgroundLayer = map.createStaticLayer('background', [terrain], 0, 0);

        // Player
        let player = this.physics.add.sprite(200, 2000, "player");
        player.setActive(true);
        player.setCollideWorldBounds(true);

        // Physics
        this.physics.add.collider(player, groundLayer);
        groundLayer.setCollisionByProperty({collides: true});

        // Input listeners
        /*this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.sprintKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);*/

        // Camera Initialization
        this.cameras.main.startFollow(player, true, 1.00, 1.00);
        //this.cameras.main.setZoom(1.25);

        // Bounds
        /*this.physics.world.setBounds(0, 0, 6400, 640);
        this.cameras.main.setBounds(0, 0, 6400, 640);*/
    }

    update() {

    }
}