class Fart extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, config.width+128, Phaser.Math.Between(0, 16000), "fart");

        scene.add.existing(this);

        scene.physics.world.enableBody(this);

        scene.farts.add(this);

        this.target = new Phaser.Math.Vector2();
        this.target.x = -256;
        this.target.y = this.y;

        this.setSize(48, 49);
    }

    update() {
        if(this.x < -128) {
            this.destroy();
        }
    }
}