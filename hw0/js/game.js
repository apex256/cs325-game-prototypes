'use strict';

let config = {
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2, Scene3],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 300 },
            overlapBias: 8
        }
    }
}

let gameSettings = {
    playerSpeed: 225,
    playerJumpVelocity: -200
}

let game = new Phaser.Game(config);