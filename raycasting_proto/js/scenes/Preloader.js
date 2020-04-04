export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.image('sky', 'assets/images/sky4.png');
    }

    create() {
        // Starting Menu scene
        this.scene.start('Game', { firstInstance: true });
    }
}