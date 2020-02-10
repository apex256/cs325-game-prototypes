'use strict';

class Scene3 extends Phaser.Scene {
    constructor() {
        super("game");

        this.gameOver = false;
    }

    create() {
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);
        this.player = this.physics.add.sprite(config.width/2, config.height/2, "player");

        // Groups
        this.blocks = this.physics.add.group({
            mass: 100
        });

        // Physics groups
        this.platforms = this.physics.add.staticGroup();

        // Player physics
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        // Input listeners
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.resetKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Ground
        this.platforms.create(400, 600, 'ground').setScale(2).refreshBody();

        // Colision
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.blocks, this.player, this.endGame, null, this);

        // Block timer
        this.timer = this.time.addEvent({
            delay: 100,
            callback: this.spawnBlock,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        this.background.tilepositionX -= 0.5;

        this.playerMovementManager();

        // Updating blocks
        for (let i = 0; i < this.blocks.getChildren().length; i++) {
            let block = this.blocks.getChildren()[i];
            block.update();
        }

        if (this.gameOver && this.resetKey.isDown) {
            this.scene.start("playGame");
            buttonSound.play();
        }
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

    spawnBlock() {
        let block = new Block(this);
    }

    endGame() {
        this.physics.pause();
        music.stop();
        this.player.setTint(0xFF0000);
        this.player.anims.play("player_turn");
        this.endText1 = this.add.bitmapText((config.width/2)-100, (config.height/2)-16, 'myFont', 'GAME OVER', 32);
        this.endText2 = this.add.bitmapText(28, (config.height/2)+16, 'myFont', 'PRESS ENTER TO GO BACK TO THE MENU', 32);
        this.gameOver = true;
    }
}