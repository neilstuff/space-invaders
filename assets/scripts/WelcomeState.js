var Constants = require('./Constants.js');
var TextEntity = require('./TextEntity.js');
var SpriteEntity = require('./SpriteEntity.js');
var Game = require('./Game.js');
class WelcomeState extends Constants {

    /** ***************************************************************************
     * A welcome state for the Space Invaders game.
     *
     * This state contains the definitions required to show the welcoming message
     * to the user(s). It contains the game name along with the score instructions
     * and an instruction how to start the game. It does not however contain a
     * complex set of game logics as the actual game simulation is not required.
     * @param {Game} game A reference to the root game instance.
     */
    constructor(game) {
        super();
        /** A reference to the root game instance. */

        this.game = game;

        window.welcomeState = this;

        // initialize the play game text.
        this.playText = new TextEntity(game);
        this.playText.setText("PLAY");
        this.playText.setAlign("center");
        this.playText.setX(672 / 2);
        this.playText.setY(175);

        // initialize the game name text.
        this.nameText = new TextEntity(game);
        this.nameText.setText("SPACE INVADERS");
        this.nameText.setAlign("center");
        this.nameText.setFillStyle("#20ff20");
        this.nameText.setX(this.playText.getX());
        this.nameText.setY(this.playText.getY() + 75);

        // initialize the single player text.
        this.singlePlayerText = new TextEntity(game);
        this.singlePlayerText.setText("PRESS [1] FOR A 1 PLAYER GAME");
        this.singlePlayerText.setAlign("center");
        this.singlePlayerText.setX(this.playText.getX());
        this.singlePlayerText.setY(this.nameText.getY() + 75);
        this.singlePlayerText.setBlinkCount(-1);
        this.singlePlayerText.setBlinkFrequency(30);
        this.singlePlayerText.blink();

        // initialize the multiplayer text.
        this.multiPlayerText = new TextEntity(game);
        this.multiPlayerText.setText("PRESS [2] FOR A 2 PLAYER GAME");
        this.multiPlayerText.setAlign("center");
        this.multiPlayerText.setX(this.playText.getX());
        this.multiPlayerText.setY(this.singlePlayerText.getY() + 50);
        this.multiPlayerText.setBlinkCount(-1);
        this.multiPlayerText.setBlinkFrequency(30);
        this.multiPlayerText.blink();

        // initialize the controls text.
        this.controlsText = new TextEntity(game);
        this.controlsText.setText("USE ARROW KEYS AND SPACEBAR TO PLAY");
        this.controlsText.setAlign("center");
        this.controlsText.setX(this.playText.getX());
        this.controlsText.setY(this.multiPlayerText.getY() + 75);

        // initiailize the score advance table text.
        this.tableCaptionText = new TextEntity(game);
        this.tableCaptionText.setText("-- SCORE ADVANCE TABLE --");
        this.tableCaptionText.setAlign("center");
        this.tableCaptionText.setX(this.playText.getX());
        this.tableCaptionText.setY(this.controlsText.getY() + 75);


        // initialize the 1st table row sprite image.
        this.tableRow1Sprite = new SpriteEntity(game);
        this.tableRow1Sprite.setImage(game.getSpriteSheet());
        this.tableRow1Sprite.setX(this.playText.getX() - 130);
        this.tableRow1Sprite.setY(this.tableCaptionText.getY() + 25);
        this.tableRow1Sprite.setWidth(43);
        this.tableRow1Sprite.setHeight(19);
        this.tableRow1Sprite.setClipX(5);
        this.tableRow1Sprite.setClipY(92);

        // initialize the 1st table row text.
        this.tableRow1Text = new TextEntity(game);
        this.tableRow1Text.setText("= ?  MYSTERY");
        this.tableRow1Text.setX(this.tableRow1Sprite.getX() + 10 + this.tableRow1Sprite.getWidth());
        this.tableRow1Text.setY(this.tableRow1Sprite.getY() + 20);

        // initialize the 2nd table row sprite image.
        this.tableRow2Sprite = new SpriteEntity(game);
        this.tableRow2Sprite.setImage(game.getSpriteSheet());
        this.tableRow2Sprite.setX(this.playText.getX() - 120);
        this.tableRow2Sprite.setY(this.tableRow1Sprite.getY() + 35);
        this.tableRow2Sprite.setWidth(24);
        this.tableRow2Sprite.setHeight(24);
        this.tableRow2Sprite.setClipX(5);
        this.tableRow2Sprite.setClipY(63);

        // initialize the 2nd table row text.
        this.tableRow2Text = new TextEntity(game);
        this.tableRow2Text.setText("= 30 POINTS");
        this.tableRow2Text.setX(this.tableRow1Text.getX());
        this.tableRow2Text.setY(this.tableRow2Sprite.getY() + 22);

        // initialize the 3rd table row sprite image.
        this.tableRow3Sprite = new SpriteEntity(game);
        this.tableRow3Sprite.setImage(game.getSpriteSheet());
        this.tableRow3Sprite.setX(this.playText.getX() - 125);
        this.tableRow3Sprite.setY(this.tableRow2Sprite.getY() + 35);
        this.tableRow3Sprite.setWidth(33);
        this.tableRow3Sprite.setHeight(24);
        this.tableRow3Sprite.setClipX(5);
        this.tableRow3Sprite.setClipY(34);

        // initialize the 3rd table row text.
        this.tableRow3Text = new TextEntity(game);
        this.tableRow3Text.setText("= 20 POINTS");
        this.tableRow3Text.setX(this.tableRow1Text.getX());
        this.tableRow3Text.setY(this.tableRow3Sprite.getY() + 22);

        // initialize the 4th table row sprite image.
        this.tableRow4Sprite = new SpriteEntity(game);
        this.tableRow4Sprite.setImage(game.getSpriteSheet());
        this.tableRow4Sprite.setX(this.playText.getX() - 125);
        this.tableRow4Sprite.setY(this.tableRow3Sprite.getY() + 35);
        this.tableRow4Sprite.setWidth(36);
        this.tableRow4Sprite.setHeight(24);
        this.tableRow4Sprite.setClipX(5);
        this.tableRow4Sprite.setClipY(5);

        // initialize the 4th table row text.
        this.tableRow4Text = new TextEntity(game);
        this.tableRow4Text.setText("= 10 POINTS");
        this.tableRow4Text.setX(this.tableRow1Text.getX());
        this.tableRow4Text.setY(this.tableRow4Sprite.getY() + 22);

    }

    /** *************************************************************************
     * Update (i.e. tick) the the logic within the state.
     * @param {double} dt The delta time from the previous tick operation.
     */
    update(dt) {
        this.playText.update(dt);
        this.nameText.update(dt);
        this.singlePlayerText.update(dt);
        this.multiPlayerText.update(dt);
        this.controlsText.update(dt);
        this.tableCaptionText.update(dt);
    }

    /** *************************************************************************
     * Render (i.e. draw) the state on the screen.
     * @param {CanvasRenderingContext2D} ctx The drawing context to use.
     */
    render(ctx) {
        this.playText.render(ctx);
        this.nameText.render(ctx);
        this.singlePlayerText.render(ctx);
        this.multiPlayerText.render(ctx);
        this.controlsText.render(ctx);
        this.tableCaptionText.render(ctx);

        // render score advance table row sprites.
        this.tableRow1Sprite.render(ctx);
        this.tableRow2Sprite.render(ctx);
        this.tableRow3Sprite.render(ctx);
        this.tableRow4Sprite.render(ctx);

        // render score advance table row texts.
        this.tableRow1Text.render(ctx);
        this.tableRow2Text.render(ctx);
        this.tableRow3Text.render(ctx);
        this.tableRow4Text.render(ctx);
    }

    /** *************************************************************************
     * A function that is called when the state is being entered.
     *
     * This function is called before the state is being updated (i.e. ticked)
     * for a first time. This makes it an ideal place to put all listener logic.
     */
    enter() {
        this.keyUpRef = this.keyUp.bind(this);

        document.addEventListener("keyup", this.keyUpRef);
    }

    /** *************************************************************************
     * A function that is called when the state is being exited.
     *
     * This function is called after the state is being updated (i.e. ticked)
     * for the last time. This makes it an ideal place to cleanup listeners etc.
     */
    exit() {
        document.removeEventListener("keyup", this.keyUp);
    }

    /** *************************************************************************
     * A key listener function called when the user releases a key press.
     * @param {KeyboardEvent} e The keyboard event received from the DOM.
     */
    keyUp(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        switch (key) {

            case Constants.KEY_1:
                this.game.setPlayerCount(1);
                this.game.setActivePlayer(1);
                break;
            case Constants.KEY_2:
                this.game.setPlayerCount(2);
                this.game.setActivePlayer(1);
                break;
        }

    }

}

module.exports = WelcomeState;