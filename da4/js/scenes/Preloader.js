export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Images
        this.load.image('titleBackground', 'assets/images/background.png');
        this.load.image('sky', 'assets/images/sky4.png');

        // Sprites
        this.load.spritesheet('player', 'assets/sprites/chicken.png', {
            frameWidth: 55,
            frameHeight: 65
        });
        this.load.spritesheet('plank', 'assets/sprites/plank.png', {
            frameWidth: 80,
            frameHeight: 80
        });
        this.load.spritesheet('arrow', 'assets/sprites/arrow.png', {
            frameWidth: 62,
            frameHeight: 46
        });
        this.load.spritesheet("ghost", "assets/sprites/ghost.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        // Bitmap font
        this.load.bitmapFont('myFont', 'assets/font/font.png', 'assets/font/font.fnt');

        // Audio
        this.load.audio('button', 'assets/audio/button_click01.ogg');
        this.load.audio('menuSong', 'assets/audio/menu_song.ogg');
        this.load.audio('wood_place', 'assets/audio/wood_place.ogg');
        this.load.audio('wood_break', 'assets/audio/wood_break.ogg');
        this.load.audio('victory', 'assets/audio/victory.ogg');

        // Tilemap loading
        this.load.image('terrain', 'assets/tiles/spritesheet.png');
        this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
    }

    create() {
        // Player animations
        this.anims.create({
            key: 'player_right',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 1
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'player_left',
            frames: this.anims.generateFrameNumbers('player', {
                start: 2,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'player_right_idle',
            frames: [ { key: 'player', frame: 0} ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'player_left_idle',
            frames: [ { key: 'player', frame: 2} ],
            frameRate: 10,
            repeat: -1
        });

        // Starting Menu scene
        this.scene.start('Menu', { firstInstance: true });
    }
}