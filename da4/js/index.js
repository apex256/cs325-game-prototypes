import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { Menu } from './scenes/Menu.js';
import { Controls } from './scenes/Controls.js';
import { Game } from './scenes/Game.js';
import { End } from './scenes/End.js';

export let config = {
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: 0x000000,
    scene: [Boot, Preloader, Menu, Controls, Game, End],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 1000 },
            overlapBias: 8
        }
    }
}

export let gameSettings = {
    playerSpeed: 300,
    playerJumpVelocity: -800,
    ghostSpeed: 200
}

new Phaser.Game(config);