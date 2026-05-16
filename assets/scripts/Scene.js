var SpaceInvaders = require('./SpaceInvaders.js');
var TextEntity = require('./TextEntity.js');
var SpaceInvaders = require('./SpaceInvaders.js');

class Scene {

    /** ***************************************************************************
     * The scene used within the Space Invaders game application.
     *
     * Space Invaders contains only one scene that is kept visible during the whole
     * application execution. This scene will always contain the 3 score at the top
     * of the scene (i.e. 1st and 2nd player scores and the high score).The center
     * contents of the screen will be changed dynamically based on the current state
     * of the game. The original version also contained the "Credit" section always
     * visible at the bottom-right corner of the scene, but we can leave that out.
     *
     * @param {SpaceInvaders.Game} game A reference to the target game instance.
     */
    constructor(game) {
        /** A reference to the root game instance. */
        this.game = game;

        /** A reference to the data and state container for the 1st player. */
        this.player1Context = game.getPlayer1Context();
        /** A reference to the data and state container for the 2nd player. */
        this.player2Context = game.getPlayer2Context();

        this.score1Caption = null;
        this.hiScoreCaption = null;
        this.score2Caption = null;

        this.score1Text = null;
        this.hiScoreText = null;
        this.score2Text = null;
        this.state = null;

        // initialize the static caption for the 1st player score.
        this.score1Caption = new TextEntity(game);
        this.score1Caption.setText("SCORE<1>");
        this.score1Caption.setAlign("center");
        this.score1Caption.setX(125);
        this.score1Caption.setY(40);

        // initialize the static caption for the high score.
        this.hiScoreCaption = new TextEntity(game);
        this.hiScoreCaption.setText("HI-SCORE");
        this.hiScoreCaption.setAlign("center");
        this.hiScoreCaption.setX(672 / 2);
        this.hiScoreCaption.setY(this.score1Caption.getY());

        // initialize the static caption for the 1st player score.
        this.score2Caption = new TextEntity(game);
        this.score2Caption.setText("SCORE<2>");
        this.score2Caption.setAlign("center");
        this.score2Caption.setX(672 - 130);
        this.score2Caption.setY(this.score1Caption.getY());

        // initialize the dynamic score value for the 1st player score.
        this.score1Text = new TextEntity(game);
        this.score1Text.setText("0000");
        this.score1Text.setAlign("center");
        this.score1Text.setX(this.score1Caption.getX());
        this.score1Text.setY(this.score1Caption.getY() + 35);

        // initialize the dynamic score value for the high score.
        this.hiScoreText = new TextEntity(game);
        this.hiScoreText.setText("0000");
        this.hiScoreText.setAlign("center");
        this.hiScoreText.setX(this.hiScoreCaption.getX());
        this.hiScoreText.setY(this.score1Text.getY());

        // initialize the dynamic score value for the 2nd player score.
        this.score2Text = new TextEntity(game);
        this.score2Text.setText("0000");
        this.score2Text.setAlign("center");
        this.score2Text.setX(this.score2Caption.getX());
        this.score2Text.setY(this.score1Text.getY());
    }

    /** *************************************************************************
     * Set and enter into the given state.
     *
     * The previous state (if any) will be first exited by calling the #exit so
     * it can perform any cleanup e.g. removing listeners from DOM objects etc.
     * When the new state is assigned, it will be entered with the #enter method.
     *
     * @param {<*>State} newState A state to be assigned.
     */
    setState(newState) {
        // exit from the previous state.
        if (this.state) {
            this.state.exit();
        }

        // assign the new state.
        this.state = newState;

        // enter into the new state.
        if (this.state) {
            this.state.enter();
        }

    }

    /** *************************************************************************
     * Update (i.e. tick) the all the game logic within the scene.
     * @param {double} dt The delta time from the previous tick operation.
     */
    update(dt) {
        // ensure that all visible score-markers are up-to-date.
        this.score1Text.setText(SpaceInvaders.toScoreString(this.player1Context.getScore()));
        this.score2Text.setText(SpaceInvaders.toScoreString(this.player2Context.getScore()));
        this.hiScoreText.setText(SpaceInvaders.toScoreString(this.game.getHiScore()));

        this.score1Caption.update(dt);
        this.hiScoreCaption.update(dt);
        this.score2Caption.update(dt);

        this.score1Text.update(dt);
        this.hiScoreText.update(dt);
        this.score2Text.update(dt);

         this.state.update(dt);
    }

    /** *************************************************************************
     * Render (i.e. draw) the all visible stuff.
     * @param {CanvasRenderingContext2D} ctx The drawing context to use.
     */
    render(ctx) {
        this.score1Caption.render(ctx);
        this.hiScoreCaption.render(ctx);
        this.score2Caption.render(ctx);

        this.score1Text.render(ctx);
        this.hiScoreText.render(ctx);
        this.score2Text.render(ctx);
        this.state.render(ctx);
    }

    getState() { return this.state; }
    getScore1Text() { return this.score1Text; }
    getScore2Text() { return this.score2Text; }

}

module.exports = Scene;
