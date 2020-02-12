class Star extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, Phaser.Math.Between(0, config.width), -500, "star");

        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.body.velocity.y = 150;

        scene.stars.add(this);
    }

    update() {
        if((this.x < -16) || (this.x > config.width+16) || (this.y > config.height+16)) {
            this.destroy();
        }
    }
}