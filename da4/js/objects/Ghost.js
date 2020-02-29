class Ghost extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, Phaser.Math.Between(3000, 6400), Phaser.Math.Between(200, 320), "ghost");
        this.scene = scene;

        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.speed = Phaser.Math.Between(200, 300);

        this.hp = 100;
        this.healthBar = new Healthbar(scene, this.x, this.y);
        scene.ghosts.add(this);
    }

    update() {
        this.healthBar.update(this.x-40, this.y-70);
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

        if (this.hp <= 0) {
            this.healthBar.destroy();
            this.destroy();
        }
    }

    onHit() {
        this.hp -= 25;
        this.healthBar.decrease(25);
    }
}