export class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'plank');

        this.setOrigin(0);

        scene.add.existing(this);
        scene.blocks.add(this);

        this.hp = 100;
    }

    update() {
        if (this.hp <= 0) {
            this.destroy();
        }
    }
}