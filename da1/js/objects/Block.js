class Block extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, Phaser.Math.Between(0, config.width), -500, "block");

        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.body.velocity.y = 150;

        scene.blocks.add(this);
    }

    update() {
        if((this.x < -48) || (this.x > config.width+48) || (this.y > config.height+48)) {
            this.destroy();
        }
    }
}