'use strict';

class Level1 extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    preload() {
        this.load.scenePlugin({
            key: "WeaponPlugin",
            url: "WeaponPlugin.js",
            sceneKey: "weapon"
        });
    }

    create() {
        this.gameOver = false;
        this.facing = "right";

        // Tilemap
        this.map = this.add.tilemap("map");
        this.terrainDefault = this.map.addTilesetImage("default", "terrainDefault");
        this.terrainCity = this.map.addTilesetImage("city", "terrainCity");

        // Tilemap layers and background sky
        this.background = this.add.tileSprite(3200, 320, 6400, 640, "titleBackground");
        this.groundLayer = this.map.createStaticLayer("ground", [this.terrainDefault, this.terrainCity], 0, 0);
        this.bg1Layer = this.map.createStaticLayer("bg1", [this.terrainDefault, this.terrainCity], 0, 0);
        this.bg1Layer = this.map.createStaticLayer("bg2", [this.terrainDefault, this.terrainCity], 0, 0);

        // Player
        this.player = this.physics.add.sprite(0, 0, "player");
        this.player.setActive(true);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.groundLayer);
        this.groundLayer.setCollisionByProperty({collides: true});

        // Groups
        this.cats = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        // Cat weapons
        this.catWeapon = this.weapon.add(300, "cat");
        this.catWeapon.bulletKillType = this.weapon.KILL_WORLD_BOUNDS;
        this.catWeapon.bulletSpeed = 800;
        this.catWeapon.fireRate = 200;
        this.catWeapon.bulletAngleVariance = 2;
        this.catWeapon.bulletSpeedVariance = 50;
        this.catWeapon.trackSprite(this.player, 15, -10, false);
        this.catWeapon.fireAngle = 345;

        // Input listeners
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // Camera Initialization
        this.cameras.main.startFollow(this.player, true, 1.00, 1.00);
        this.cameras.main.setZoom(1.25);

        // Bounds
        this.physics.world.setBounds(0, 0, 6400, 640);
        this.cameras.main.setBounds(0, 0, 6400, 640);
    }

    update() {
        if (!this.gameOver) 
            this.playerMovementManager();

        if (this.gameOver && this.resetKey.isDown) {
            this.scene.start("playGame");
            buttonSound.play();
        }

        if (this.shootKey.isDown) {
            this.catWeapon.fire();
        }

        if (this.facing == "right") {
            this.catWeapon.fireAngle = 345;
        }
        else {
            this.catWeapon.fireAngle = 195;
        }
     }

    playerMovementManager() {
        // Directional movement
        if (this.cursorKeys.left.isDown) {
            this.facing = "left";
            this.player.setVelocityX(-gameSettings.playerSpeed);
            this.player.anims.play("player_left", true);
        }
        else if (this.cursorKeys.right.isDown) {
            this.facing = "right";
            this.player.setVelocityX(gameSettings.playerSpeed);
            this.player.anims.play("player_right", true);
        }
        else {
            this.player.setVelocityX(0);
            if (this.facing == "left") {
                this.player.anims.play("player_left_idle", true);
            }
            else {
                this.player.anims.play("player_right_idle", true);
            }
        }

        // Jumping
        if (this.jumpKey.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(gameSettings.playerJumpVelocity);
        }
    }
}