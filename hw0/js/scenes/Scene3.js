'use strict';

class Scene3 extends Phaser.Scene {
    constructor() {
        super("game");
    }

    create() {
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);
        this.player = this.physics.add.sprite(config.width/2, config.height/2, "player");
        this.playerFacing = "left";

        // Physics groups
        this.boxes = this.physics.add.group();
        this.platforms = this.physics.add.staticGroup();

        // Player physics
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Ground
        this.platforms.create(400, 600, 'ground').setScale(2).refreshBody();

        // Colision
        this.physics.add.collider(this.player, this.platforms);
    }

    update() {
        this.background.tilepositionX -= 0.5;

        this.playerMovementManager();
    }

    playerMovementManager() {
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
            this.player.anims.play("player_turn", true);
        }

        if (this.jumpKey.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(gameSettings.playerJumpVelocity);
        }
    }
}