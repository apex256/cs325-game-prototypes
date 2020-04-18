'use strict';

export class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene, bulletType) {
        super(scene, 0, 0, '', '');

        this.setBlendMode(1);
        this.setDepth(1);

        this.speed = 1000;
        this.lifespan = 1000;

        this._temp = new Phaser.Math.Vector2();
    }

    update(time, delta) {
        this.lifespan -= delta;

        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }

    fire(player) {
        this.lifespawn = 100;
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(player.body.rotation);
        this.setPosition(player.x, player.y);
        this.body.reset(player.x, player.y);

        let angle = Phaser.Math.DegToRad(player.body.rotation);
        this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);

        this.body.velocity.x *= 2;
        this.body.velocity.y *= 2;
    }
}