'use strict';

// Imports
let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io').listen(server);

// Players object list
let players = {};

// Defining server public directory
app.use(express.static(__dirname + '/public'));

// Defining server index.html page file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// On socket connection
io.on('connection', (socket) => {
    let address = socket.request.connection.remoteAddress;
    console.log(`User ${socket.id} connected from ${address}`);

    // Creating a new player and adding it to the players object
    players[socket.id] = {
        color: Math.floor(Math.random()*0xFFFFFF),
        rotation: 0,
        x: 256,
        y: 128,
        id: socket.id
    };
    // Send the players object to the new player
    socket.emit('currentPlayers', players);
    // Update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // On socket disconnect
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
        // Removing the player from our players object
        delete players[socket.id];
        // Emitting a message to all players to remove this player
        io.emit('disconnect', socket.id);
    });

    // On player movement update movement data
    socket.on('playerMovement', (movementData) => {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].rotation = movementData.rotation;

        // Emit a message to all players about the player that has moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });
});

// Server listener
server.listen(10081, () => {
    console.log(`Listening on port ${server.address().port}`);
});