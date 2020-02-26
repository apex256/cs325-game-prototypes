class Ghost extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, Phaser.Math.Between(0, config.width), -500, "ghost");

        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.body.velocity.y = 150;

        scene.ghosts.add(this);
    }

    update() {
        if((this.x < -16) || (this.x > config.width+16) || (this.y > 16000+16)) {
            this.destroy();
        }
    }
}