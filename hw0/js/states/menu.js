let myGame = {};

myGame.Menu = function(game) {
    let startText;
    let copyright;
    let startTextTimer;
    let enterKey;
    let music;
    let buttonSound;
};

myGame.Menu.prototype = {
    preload: function() {
        this.load.bitmapFont('myFont', 'assets/fonts/bitmapFonts/font.png', 'assets/fonts/bitmapFonts/font.fnt');
        this.load.image('sky', 'assets/skies/sky2.png');
        this.load.audio('music01', 'assets/audio/music01.ogg');
        this.load.audio('pressEnter', 'assets/audio/ui_press.ogg')
    },

    create: function () {
        this.add.image(0, 0, 'sky');

        startTextTimer = 0;
        startText = this.add.bitmapText((this.world.width/2)-240, (this.world.height/2)-16, 'myFont', 'PRESS ENTER TO BEGIN', 32);
        copyright = this.add.bitmapText(6, this.world.height-24, 'myFont', 'Made by David Mark McMasters', 16);
        music = this.add.audio('music01');
        buttonSound = this.add.audio('pressEnter');

        // Inputs
        enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },

    update: function() {
        // Blinking text for the menu
        startTextTimer += this.time.elapsed;
        if (startTextTimer >= 750) {
            startTextTimer = 0;
            startText.visible = !startText.visible;
        }

        // Transition to next state on ENTER press
        if (enterKey.isDown) this.startGame();
    },

    startGame: function() {
        this.state.start('level01');
        buttonSound.play();
        music.play();
    }
}