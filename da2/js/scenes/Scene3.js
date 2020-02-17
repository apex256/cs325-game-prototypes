'use strict';

class Scene3 extends Phaser.Scene {
    constructor() {
        super("game");
    }

    create() {
        this.gameOver = false;
        this.gameOverSound = this.sound.add('gameOver');
        this.starSound = this.sound.add('starSound');

        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);
        this.player = this.physics.add.sprite(config.width/2, config.height/2, "player").setScale(2);

        this.score = 0;
        this.scoreText = this.add.bitmapText(0, 0, 'myFont', 'Score = 0', 32);

        // Groups
        this.blocks = this.physics.add.group({
            mass: 100
        });
        this.stars = this.physics.add.group({
            mass: 100
        });
        this.platforms = this.physics.add.staticGroup();

        // Player physics
        this.player.setBounce(0.9);
        this.player.setCollideWorldBounds(true);

        // Input listeners
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.resetKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.sprintKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Ground
        this.platforms.create(400, 600, 'ground').setScale(2).refreshBody();

        // Colision
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.blocks, this.player, this.endGame, null, this);
        this.physics.add.overlap(this.player, this.stars, this.addScore, null, this);

        // Block timer
        this.blockTimer = this.time.addEvent({
            delay: 200,
            callback: this.spawnBlock,
            callbackScope: this,
            loop: true
        });

        // Star timer
        this.starTimer = this.time.addEvent({
            delay: 100,
            callback: this.spawnStar,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        this.background.tilepositionX -= 0.5;

        if (!this.gameOver) 
            this.playerMovementManager();

        // Updating blocks
        for (let i = 0; i < this.blocks.getChildren().length; i++) {
            let block = this.blocks.getChildren()[i];
            block.update();
        }

        // Updating stars
        for (let i = 0; i < this.stars.getChildren().length; i++) {
            let star = this.stars.getChildren()[i];
            star.update();
        }

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
            this.player.anims.play("player_idle", true);
        }

        // Jumping
        if (this.jumpKey.isDown) {
            this.player.setVelocityY(gameSettings.playerJumpVelocity);
        }

        // Sprinting
        if (this.sprintKey.isDown && this.player.body.touching.down) {
            gameSettings.playerSpeed = 400;
        }
        else {
            gameSettings.playerSpeed = 225;
        }
    }

    spawnBlock() {
        let block = new Block(this);
    }

    spawnStar() {
        let star = new Star(this);
    }

    addScore(player, star) {
        this.starSound.play();
        star.destroy();
        this.score += 100;
        this.scoreText.setText("Score: " + this.score);
    }

    endGame() {
        this.physics.pause();
        this.player.anims.stop();
        music.stop();
        this.gameOverSound.play();
        this.player.setTint(0xFF0000);
        this.player.anims.play("player_turn");
        this.endText1 = this.add.bitmapText((config.width/2)-100, (config.height/2)-16, 'myFont', 'GAME OVER', 32);
        this.endText2 = this.add.bitmapText(28, (config.height/2)+16, 'myFont', 'PRESS ENTER TO GO BACK TO THE MENU', 32);
        this.gameOver = true;
    }
}