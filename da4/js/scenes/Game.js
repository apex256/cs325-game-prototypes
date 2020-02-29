'use strict';

let cond;

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.gameOver = false;
        this.facing = 'right';
        this.hp = 100;
        this.music = this.sound.add('music');
        this.shoot = this.sound.add('shoot');
        this.music.play();
        this.ghostCount = 50;

        // Tilemap
        this.map = this.add.tilemap('map');
        this.terrainDefault = this.map.addTilesetImage('default', 'terrainDefault');
        this.terrainCity = this.map.addTilesetImage('city', 'terrainCity');

        // Tilemap layers and background sky
        this.background = this.add.tileSprite(3200, 320, 6400, 640, 'titleBackground');
        this.groundLayer = this.map.createStaticLayer('ground', [this.terrainDefault, this.terrainCity], 0, 0);
        this.bg1Layer = this.map.createStaticLayer('bg1', [this.terrainDefault, this.terrainCity], 0, 0);
        this.bg1Layer = this.map.createStaticLayer('bg2', [this.terrainDefault, this.terrainCity], 0, 0);

        // Player
        this.player = this.physics.add.sprite(120, 540, 'player');
        this.player.setActive(true);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.groundLayer);
        this.groundLayer.setCollisionByProperty({collides: true});
        this.health = new Healthbar(this, this.player.x-40, this.player.y-44);

        // Groups
        this.ghosts = this.physics.add.group({
            allowGravity: false
        });

        // Input listeners
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.sprintKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Camera Initialization
        this.cameras.main.startFollow(this.player, true, 1.00, 1.00);
        this.cameras.main.setZoom(1.25);

        // Bounds
        this.physics.world.setBounds(0, 0, 6400, 640);
        this.cameras.main.setBounds(0, 0, 6400, 640);

        this.physics.add.overlap(this.player, this.ghosts, this.playerHit, null, this);

        for (let i = 0; i < this.ghostCount; i++) {
            this.spawnGhost();
        }
    }

    update() {
        if (!this.gameOver) 
            this.playerMovementManager();

        // Updating ghosts
        for (let i = 0; i < this.ghosts.getChildren().length; i++) {
            let ghost = this.ghosts.getChildren()[i];
            ghost.update();
        }
        this.health.update(this.player.x-40, this.player.y-44);

        if (this.hp <= 0) {
            cond = 0;
            this.endGame();
        }

        if (this.ghosts.getChildren().length <= 0) {
            cond = 1;
            this.endGame();
        }

        if (this.gameOver) {
            buttonSound.play();
            this.scene.start('end');
        }
     }

    playerMovementManager() {
        // Directional movement
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
        if (this.jumpKey.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(gameSettings.playerJumpVelocity);
        }

        // Sprinting
        if (this.sprintKey.isDown && this.player.body.onFloor()) {
            gameSettings.playerSpeed = 650;
        }
        else {
            gameSettings.playerSpeed = 400;
        }
    }

    spawnGhost() {
        let ghost = new Ghost(this);
        ghost.setScale(5);
    }

    playerHit() {
        this.hp -= 0.1;
        this.health.decrease(0.1);
    }

    endGame() {
        this.gameOver = true;
        this.physics.pause();
        this.player.anims.stop();
        this.player.setTint(0xFF0000);
    }

    destroy() {
        console.log('ass');
        this.WEAPON_PLUGIN.destroy();
    }
}