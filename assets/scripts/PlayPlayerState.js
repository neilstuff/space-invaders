var TextEntity = require('./TextEntity.js');
var Controller = require('./Controller.js');
var Game = require('./Game.js');

class PlayPlayerState {

    constructor(game) {
        this.game = game;
        /** A constant definition of ticks before this state automatically proceeds. */
        this.VISIBILITY_TICKS = (30 * 5);

        /** A counter of ticks before automatically proceeding to next state. */
        this.tickCounter = this.VISIBILITY_TICKS;

        /** A text entity to be shown. */
        this.text = new TextEntity(game);

        this.text.setText("PLAY PLAYER<" + this.game.getActivePlayer() + ">");
        this.text.setAlign("center");
        this.text.setX(672 / 2);
        this.text.setY(400);
    }

    /** *************************************************************************
     * Update (i.e. tick) the the logic within the state.
     * @param {double} dt The delta time from the previous tick operation.
     */
    update(dt) {
        this.tickCounter--;
        if (this.tickCounter <= 0) {
            this.game.getScene().setState(new Controller(this.game));
        }
    }

    /** *************************************************************************
     * Render (i.e. draw) the state on the screen.
     * @param {CanvasRenderingContext2D} ctx The drawing context to use.
     */
    render(ctx) {
        this.text.render(ctx);
    }

    /** *************************************************************************
     * A function that is called when the state is being entered.
     *
     * This function is called before the state is being updated (i.e. ticked)
     * for a first time. This makes it an ideal place to put all listener logic.
     */
    enter() {
    }

    /** *************************************************************************
     * A function that is called when the state is being exited.
     *
     * This function is called after the state is being updated (i.e. ticked)
     * for the last time. This makes it an ideal place to cleanup listeners etc.
     */
    exit() {
    }

}

module.exports = PlayPlayerState;
