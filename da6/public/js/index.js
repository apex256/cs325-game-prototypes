
import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { Menu } from './scenes/Menu.js';
import { Controls } from './scenes/Controls.js';
import { Game } from './scenes/Game.js';


// Game config object
export let config = {
    width: 1366,
    height: 768,
    parent: 'game',
    backgroundColor: 0x000000,
    scene: [Boot, Preloader, Menu, Controls, Game],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 },
            overlapBias: 8
        }
    }
}

// Game specific settings object
export let gameSettings = {
    playerSpeed: 300,
    playerJumpVelocity: -800,
    ghostSpeed: 200
}

// Is between function (bounds1 is top left, bounds2 is bottom right)
export let isBetween = function(x, y, bounds_x1, bounds_y1, bounds_x2, bounds_y2) {
    if ((x >= bounds_x1) && (x <= bounds_x2) && (y >= bounds_y1) && (y <= bounds_y2)) {
        return true;
    }
    else {
        return false;
    }
}

// Length of a line given the endpoints
export let lineLength = function(ep1_x, ep1_y, ep2_x, ep2_y) {
    return Math.sqrt(Math.pow((ep2_x-ep1_x), 2) + Math.pow((ep2_y-ep1_y), 2));
}

new Phaser.Game(config);

/*function preload() {}

function create() {
    this.socket = io();
}

function update() {}*/