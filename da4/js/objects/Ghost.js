export class Ghost extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, Phaser.Math.Between(0, 1600), 100, 'ghost');

        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.speed = Phaser.Math.Between(200, 300);

        scene.ghosts.add(this);
    }

    update() {
        if (this.scene.player.x + 10 < this.x) {
            this.body.velocity.x = -this.speed;
        }
        else if (this.scene.player.x - 10 > this.x) {
            this.body.velocity.x = this.speed;
        }

        if (this.scene.player.y < this.y) {
            this.body.velocity.y = -this.speed;
        }
        else {
            this.body.velocity.y = this.speed;
        }
    }
}