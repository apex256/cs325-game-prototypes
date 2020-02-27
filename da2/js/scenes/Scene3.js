'use strict';

class Scene3 extends Phaser.Scene {
    constructor() {
        super("game");
    }

    create() {
        this.gameOver = false;

        this.gameOverSound = this.sound.add('gameOver');

        // Camera setup
        this.cameras.main.setBounds(0, 0, 800, 16000);

        // Tilemap
        this.map = this.add.tilemap("map");
        this.terrain = this.map.addTilesetImage("galaxy-Z", "terrain");

        // Tilemap layers
        this.layer1 = this.map.createStaticLayer("Tile Layer 1", [this.terrain], 0, 0);

        // Player
        this.player = this.physics.add.sprite(config.width/2, 15800, "player");
        this.player.setBounce(0.5);
        this.player.setCollideWorldBounds(true);
        this.player.setSize(20, 26);
        this.player.setScale(2);

        // Groups
        this.farts = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });
        this.platforms = this.physics.add.staticGroup();

        // Input listeners
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.resetKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.sprintKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Ground
        this.platforms.create(400, 16000, 'ground').setScale(4).refreshBody();

        // Colision
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.farts, this.player, this.endGame, null, this);

        // Fart timer
        this.fartTimer = this.time.addEvent({
            delay: 1,
            callback: this.spawnFart,
            callbackScope: this,
            loop: true
        });

        // Camera Initialization
        this.cameras.main.startFollow(this.player, true, 1.00, 1.00);
        this.cameras.main.setZoom(1.25);

        // Bounds
        this.physics.world.setBounds(0, 0, 800, 16000);

        // Fart sound
        this.fartSound = this.sound.add('fart');
        this.fartSoundTimer = this.time.addEvent({
            delay: 5000,
            callback: () => {this.fartSound.play();},
            callbackScope: this,
            loop: true
        });

        // Heaven image
        this.add.image(400, 800, "heaven");
    }

    update() {
        if (this.player.y < 400) {
            this.winGame();
        }

        if (!this.gameOver) 
            this.playerMovementManager();

        // Updating farts
        for (let i = 0; i < this.farts.getChildren().length; i++) {
            let fart = this.farts.getChildren()[i];
            fart.update();
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
    }

    spawnFart() {
        let fart = new Fart(this);
        this.physics.moveToObject(fart, fart.target, 250);
    }

    endGame() {
        this.physics.pause();
        this.player.anims.stop();
        music.stop();
        this.gameOverSound.play();
        this.player.setTint(0xFF0000);
        this.add.bitmapText((config.width/2)-35, (this.player.y)-16, 'myFont', 'GAME OVER', 24);
        this.add.bitmapText(128, (this.player.y)+16, 'myFont', 'PRESS ENTER TO GO BACK TO THE MENU', 24);
        this.gameOver = true;
    }

    winGame() {
        this.physics.pause();
        this.player.anims.stop();
        music.stop();
        this.add.bitmapText((config.width/2)-35, (this.player.y)-16, 'myFont', 'YOU WIN!', 24);
        this.add.bitmapText(128, (this.player.y)+16, 'myFont', 'PRESS ENTER TO GO BACK TO THE MENU', 24);
        this.gameOver = true;
    }
}