'use strict';

class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("background", "assets/sky2.png");
        this.load.image("ground", "assets/platform.png");
        this.load.spritesheet("block", "assets/block_green.png", {
            frameWidth: 48,
            frameHeight: 48
        });
        this.load.spritesheet("star", "assets/star.png", {
            frameWidth: 24,
            frameHeight: 22
        });
        this.load.spritesheet("player", "assets/ghost.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.bitmapFont('myFont', 'assets/font.png', 'assets/font.fnt');
        this.load.audio('music', 'assets/music01.ogg');
        this.load.audio('press', 'assets/ui_press.ogg');
        this.load.audio('gameOver', 'assets/alien_death1.wav');
        this.load.audio('starSound', 'assets/numkey.wav');
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");

        // Player animations
        this.anims.create({
            key: "player_idle",
            frames: [ { key: 'player', frame: 0} ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "player_left",
            frames: [ { key: 'player', frame: 1} ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "player_right",
            frames: [ { key: 'player', frame: 2 } ],
            frameRate: 20,
            repeat: -1
        });
    }
}