"use strict";

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600
};

let game = new Phaser.Game(config);

// Adding game states
game.state.add('menu', myGame.Menu);
game.state.add('level01', myGame.level01);
game.state.start('menu');

/*window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    let game = new Phaser.Game(config);
    
    game.state.add( "main", make_main_game_state( game ) );
    
    game.state.start( "main" );
};
*/