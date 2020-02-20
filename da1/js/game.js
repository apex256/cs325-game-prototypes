'use strict';

let config = {
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2, Scene3],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 30 },
            overlapBias: 8
        }
    }
}

let gameSettings = {
    playerSpeed: 400,
    playerJumpVelocity: -200
}

let game = new Phaser.Game(config);