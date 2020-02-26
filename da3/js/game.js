'use strict';

let config = {
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: 0x000000,
    scene: [Boot, Title, Controls, Level1],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 1000 },
            overlapBias: 8
        }
    }
}

let gameSettings = {
    playerSpeed: 300,
    playerJumpVelocity: -400
}

let game = new Phaser.Game(config);