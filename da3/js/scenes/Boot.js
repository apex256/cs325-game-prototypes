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
        this.load.spritesheet("ghost", "assets/sprites/ghost.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        // Bitmap font
        this.load.bitmapFont("myFont", "assets/font/font.png", "assets/font/font.fnt");

        // Audio
        this.load.audio("music", "assets/audio/music01.ogg");
        this.load.audio("button", "assets/audio/menu_select.mp3");
        this.load.audio("shoot", "assets/audio/shot1.wav");

        // Tilemap loading
        this.load.image("terrainDefault", "assets/tiles/default.png");
        this.load.image("terrainCity", "assets/tiles/city.png");
        this.load.tilemapTiledJSON("map", "assets/maps/map.json");
    }

    create() {
        buttonSound = this.sound.add("button");

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
        this.anims.create({
            key: "player_right_idle",
            frames: [ { key: "player", frame: 0} ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "player_left_idle",
            frames: [ { key: "player", frame: 2} ],
            frameRate: 10,
            repeat: -1
        });

        // Ghost animations
        this.anims.create({
            key: "ghost_idle",
            frames: [ { key: "ghost", frame: 0} ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "ghost_left",
            frames: [ { key: "ghost", frame: 1} ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "ghost_right",
            frames: [ { key: "ghost", frame: 2 } ],
            frameRate: 20,
            repeat: -1
        });
    }
}