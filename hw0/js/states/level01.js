myGame.level01 = function(game) {
    let text;
};

myGame.level01.prototype = {
    create: function() {
        this.game.stage.backgroundColor = "#0000FF";
        text = this.add.text(this.world.centerX, this.world.centerY, 'Menu', {fill: "#FFFFFF"});
        text.inputEnabled = true;
        text.events.onInputDown.add(this.go, this);
    },
    go: function() {
        this.state.start('menu');
    }
}