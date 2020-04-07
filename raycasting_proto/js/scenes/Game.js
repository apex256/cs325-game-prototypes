'use strict';

import { config } from "../index.js";
import { worldMap } from "../index.js";

let posX = 22;
let posY = 12;
let dirX = -1;
let dirY = 0;
let planeX = 0;
let planeY = 0.66;

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.lines = this.add.group();

        this.time.addEvent({
            delay: 1,
            callback: ()=>{
                this.lines.clear(true, true)
            },
            loop: true
        });
    }

    update(time, delta) {
        for (let x = 0; x < config.width; x++) {
            let cameraX = 2 * x / parseFloat(config.width) - 1;
            let rayDirX = parseFloat(dirX + planeX) * cameraX;
            let rayDirY = parseFloat(dirY + planeY) * cameraX;

            // Which box in the map the player is currently in
            let mapX = parseInt(posX);
            let mapY = parseInt(posY);

            // Length of ray from current position to next x-side or y-side
            let sideDistX;
            let sideDistY;

            // Length of ray from one x-side or y-side to next x-side or y-side
            let deltaDistX = (rayDirY == 0) ? 0 : ((rayDirX == 0) ? 1 : Math.abs(1/rayDirX));
            let deltaDistY = (rayDirX == 0) ? 0 : ((rayDirY == 0) ? 1 : Math.abs(1/rayDirY));
            let perpWallDist;

            // What direction to step in x or y (either +1 or -1)
            let stepX;
            let stepY;

            // Was a wall hit?
            let hit = 0;
            // Was a NS or EW wall hit?
            let side;

            // calculate step and initial sideDist
            if (rayDirX < 0) {
                stepX = -1;
                sideDistX = (posX - mapX) * deltaDistX;
            }
            else {
                stepX = 1;
                sideDistX = (mapX + 1.0 - posX) * deltaDistX;
            }
            if (rayDirY < 0) {
                stepY = -1;
                sideDistY = (posY - mapY) * deltaDistY;
            }
            else {
                stepY = 1;
                sideDistY = (mapY + 1.0 - posY) * deltaDistY;
            }

            // Perform DDA
            while (hit == 0) {
                // Jump to next map square, OR in x-direction, OR in y-direction
                if (sideDistX < sideDistY) {
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                }
                else {
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                }

                // Check if ray has hit a wall
                if (worldMap[mapX][mapY] > 0) { 
                    hit = 1; 
                }
            }

            // Calculate distance projected on camera direction (Euclidean distance will give fisheye effect)
            if (side == 0) {
                perpWallDist = (mapX - posX + (1 - stepX) / 2) / rayDirX;
            }
            else {
                perpWallDist = (mapY - posY + (1 - stepY) / 2) / rayDirY;
            }

            // Calculate height of line to draw on screen
            let lineHeight = parseInt(config.height / perpWallDist);

            // Calculate lowest and highest pixel to fill in current stripe
            let drawStart = -lineHeight / 2 + config.height / 2;
            if (drawStart < 0) {
                drawStart = 0;
            }
            let drawEnd = lineHeight / 2 + config.height / 2;
            if (drawEnd >= config.height) {
                drawEnd = config.height - 1;
            }

            // Choosing wall color
            let color;
            switch(worldMap[mapX][mapY]) {
                // Red
                case 1:
                    color = 0xFF0000;
                    break;
                // Green
                case 2:
                    color = 0x00FF00;
                    break;
                // Blue
                case 3:
                    color = 0x0000FF;
                    break;
                // White
                case 4:
                    color = 0xFFFFFF;
                    break;
                // Yellow
                default:
                    color = 0xFFFF00;
                    break;
            }

            // Give x and y sides different brightness
            if (side == 1) {
                color = color / 2;
            }

           this.lines.add(this.add.line(x, drawStart, 0, 0, 0, drawEnd, color));
           //this.lines.add(new Phaser.Geom.Line(x, drawStart, x, drawEnd));
           //this.line = new Phaser.Geom.Line(x, drawStart, x, drawEnd);
        }
        console.log(this.lines.getLength());

        // Timing for input and FPS counter
        let frameTime = delta / 1000.0; // Time this frame has taken in seconds

        // Speed modifiers
        let moveSpeed = frameTime * 5.0;
        let rotSpeed = frameTime * 3.0;

        // Go forward
        if (this.upKey.isDown) {
            if (worldMap[parseInt(posX + dirX * moveSpeed)][parseInt(posY)] <= 0) {
                posX += dirX * moveSpeed;
            }
            if (worldMap[parseInt(posX)][parseInt(posY + dirY * moveSpeed)] <= 0) {
                posY += dirY * moveSpeed;
            }
        }

        // Go forward
        if (this.downKey.isDown) {
            if (worldMap[parseInt(posX - dirX * moveSpeed)][parseInt(posY)] <= 0) {
                posX -= dirX * moveSpeed;
            }
            if (worldMap[parseInt(posX)][parseInt(posY - dirY * moveSpeed)] <= 0) {
                posY -= dirY * moveSpeed;
            }
        }

        // Rotate right
        if (this.rightKey.isDown) {
            // Both camera direction and camera plane must be rotated
            let oldDirX = dirX;
            dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
            dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
            let oldPlaneX = planeX;
            planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
            planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);
        }
        // Rotate Left
        if (this.leftKey.isDown) {
            // Both camera direction and camera plane must be rotated
            let oldDirX = dirX;
            dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
            dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
            let oldPlaneX = planeX;
            planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
            planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);
        }
    }
}