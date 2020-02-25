'use strict';

let buttonSound;

class Boot extends Phaser.Scene {
    constructor() {
        super("boot");
    }

    preload() {
        // Images and spritesheets
        this.load.image("titleBackground", "assets/images/deepblue.png");
        this.load.spritesheet("cat", "assets/sprites/cat.png", {
            frameWidth: 22,
            frameHeight: 20
        });
        this.load.spritesheet("player", "assets/sprites/player.png", {
            frameWidth: 24,
            frameHeight: 46
        });

        // Bitmap font
        this.load.bitmapFont("myFont", "assets/font/font.png", "assets/font/font.fnt");

        // Audio
        //this.load.audio('music', 'assets/music01.ogg');

        // Tilemap loading
        this.load.image("terrainDefault", "assets/tiles/default.png");
        this.load.image("terrainCity", "assets/tiles/city.png");
        this.load.tilemapTiledJSON("map", "assets/maps/map.json");
    }

    create() {
        //buttonSound = this.sound.add("press");

        this.scene.start("title");

        // Player animations
        this.anims.create({
            key: "player_right",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 1
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "player_left",
            frames: this.anims.generateFrameNumbers("player", {
                start: 2,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
    }
}