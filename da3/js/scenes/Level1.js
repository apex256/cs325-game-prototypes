'use strict';

class Level1 extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    create() {
        this.gameOver = false;

        // Camera setup
        //this.cameras.main.setBounds(0, 0, 800, 16000);

        // Tilemap
        this.map = this.add.tilemap("map");
        this.terrainDefault = this.map.addTilesetImage("default", "terrainDefault");
        this.terrainCity = this.map.addTilesetImage("city", "terrainCity");

        // Tilemap layers
        this.botLayer = this.map.createStaticLayer("ground", [this.terrain], 0, 0);

        // Player
        this.player = this.physics.add.sprite(config.width/2, config.height/2, "player");
        /*this.player.setBounce(0.5);
        this.player.setCollideWorldBounds(true);
        this.player.setSize(20, 26);
        this.player.setScale(2);*/

        // Input listeners
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Camera Initialization
        this.cameras.main.startFollow(this.player, true, 1.00, 1.00);
        this.cameras.main.setZoom(1.25);

        // Bounds
        //this.physics.world.setBounds(0, 0, 800, 16000);
    }

    update() {
        if (!this.gameOver) 
            this.playerMovementManager();

        if (this.gameOver && this.resetKey.isDown) {
            this.scene.start("playGame");
            buttonSound.play();
        }
     }

    playerMovementManager() {
        // Directional movement
        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
            this.player.anims.play("player_left", true);
        }
        else if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
            this.player.anims.play("player_right", true);
        }
        else {
            this.player.setVelocityX(0);
        }

        // Jumping
        if (this.jumpKey.isDown) {
            this.player.setVelocityY(gameSettings.playerJumpVelocity);
        }
    }
}