/** ***************************************************************************
 * The root game structure for the Space Invaders game.
 *
 * This object module contains the necessary structure to glue the game objects
 * as a working game. It acts as the main entry point for the application which
 * is used to start the game and to provide a support for the scene system.
 *
 * The application can be created and started with the following way:
 *
 * var game = new SpaceInvaders();
 * game.start();
 *
 * After being constructed and called with the previously mentioned way, the
 * application starts running and will run until the browser window is being
 * closed or whether an application execption is raised.
 */


var Constants = require('./Constants.js');
var SpaceInvaders = require('./SpaceInvaders.js');
var Scene = require('./Scene.js');
var PlayerContext = require('./PlayerContext.js');
var WelcomeState = require('./WelcomeState.js');
var PlayPlayerState = require('./PlayPlayerState.js');

class Game extends Constants {

    constructor() {
        super();
        /** A definition whether the game is initialized or not. */
        this.initialized = false;
        /** A reference to the HTML5 canvas used as the rendering target. */
        this.canvas = null;
        /** A reference to the 2D drawing context from the HTML5 canvas. */
        this.ctx = null;
        /** A reference to the currently active scene. */
        this.scene = null;
        /** A definition of the time when the game was previously updated. */
        this.previousTickTime = 0;
        /** A delta accumulator that collects the exceeding update time delta. */
        this.deltaAccumulator = 0;

        /** A container for the state and data of the 1st player. */
        this.player1Context = new PlayerContext(this);
        /** A container for the state and data of the 2nd player. */
        this.player2Context = new PlayerContext(this);

        /** The hi-score of the current game instace. */
        this.hiScore = 0;

        /** The amount of players. */
        this.playerCount = 2;
        /** The currently active player. */
        this.activePlayer = 1;

        /** The sprite sheet containing all image assets for the game. */
        this.spriteSheet = undefined;

    }

    /** *************************************************************************
     * Set the active player for the game.
     *
     * When this function is called, the active player will be changed. This
     * makes the game to show the "PLAY PLAYER<?>" state to notify the next
     * player to prepare to play the game. This function is typically only used
     * when playing the game in a multiplayer mode.
     *
     * @param {integer} newActivePlayer A number {1|2} based on the target player.
     */
    setActivePlayer(newActivePlayer) {

        this.activePlayer = newActivePlayer;

        if (this.scene) {
            if (this.activePlayer == 1) {
                // blink and show only score for the 1st player.
                this.scene.getScore1Text().setVisible(true);
                this.scene.getScore1Text().blink();
                this.scene.getScore2Text().setVisible(false);
            } else if (this.activePlayer == 2) {
                // blink and show only score for the 2nd player.
                this.scene.getScore2Text().setVisible(true);
                this.scene.getScore2Text().blink();
                this.scene.getScore1Text().setVisible(false);
            }
           
            this.scene.setState(new PlayPlayerState(this));

        }
    }

    /** ***********************************************************************
     * Get the definition whether the game is initialized.
     *
     * This function provides a simple way to externally check whether the game
     * has been inited successfully and is ready to run (or already running).
     *
     * @return {[]} A definition whether the game is inited.
     */
    isInitialized() {
        return this.initialized;
    };

    /** ***********************************************************************
     * Get a reference to the currently active scene.
     *
     * This function returns a reference to currently active scene. If there is
     * currently no active scene, then this function returns the default value
     * (undefined) as a result.
     *
     * @return {Scene} The currently active scene or undefined.
     */
    getScene() {
        return this.scene;
    }

    /** ***********************************************************************
     * Initialize the game.
     *
     * Initialization will ensure that the game will get a reference to the 2D
     * drawing context from the game canvas element. It also provides a way to
     * define a game wide initializations for game scenes etc.
     *
     * @return {boolean} A definition whether the initialization succeeded.
     */
    init() {
        // a sanity check to prevent re-initialization.
        if (this.initialized == true) {
            console.error("Unable to re-initialize the game.")
            return false;
        }

        // get a reference to the target <canvas> element.
        if (!(this.canvas = document.getElementById(Game.CANVAS_ID))) {
            console.error("Unable to find the required canvas element.");
            return false;
        }

        // get a reference to the 2D drawing context.
        if (!(this.ctx = this.canvas.getContext("2d"))) {
            console.error("Unable to get a reference to 2D draw context.");
            return false;
        }

        // TODO make this a synchronous load to avoid invalid references?
        // load the source sprite sheet as an image.
        this.spriteSheet = new Image();
        this.spriteSheet.src = "assets/images/space_invaders_spritesheet.png";

        // initialize the only scene used within the application.
        this.scene = new Scene(this);
        // construct and assign the initial welcoming state.
        this.scene.setState(new WelcomeState(this));

        // when the code reaches this point, the initialization succeeded.
        this.initialized = true;

        return true;

    }

    /** ***********************************************************************
     * Run the game.
     *
     * Running the game means that the game will execute an infinite loop that
     * runs the game logic updates and draw operations until the user closes
     * the browser tab or the JavaScript catches and exception from the code.
     *
     * It's quite important to note that the requestAnimationFrame provides the
     * tickTime automatically when it uses the function as a callback.
     *
     * @param {double} tickTime A timestamp when the function is called.
     */
    run(tickTime) {
        // calculate a delta time and store the current tick time.
        var dt = (tickTime - this.previousTickTime);
        this.previousTickTime = tickTime;

        // update and draw the scene only when we have reasonable delta.
        if (dt < 100) {
            this.deltaAccumulator += dt;
            while (this.deltaAccumulator >= Game.FPS) {
                this.scene.update(Game.FPS);
                this.deltaAccumulator -= Game.FPS;
            }

            // swipe old contents from the draw buffer and draw the scene.
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.scene.render(this.ctx);

        }

        // perform a main loop iteration.
        requestAnimationFrame(this.run.bind(this));

    }

    /** ***********************************************************************
     * Start the game.
     *
     * Game will be first initialized and the started. Game will be using an
     * infinite loop (via requestAnimationFrame) as the main loop, so the game
     * will not stop running until the user closes the browser tab or if an
     * error is detected by the browser JavaScript engine.
     */
    start() {

        if (this.init()) {
            this.run(0);
        }

    }

    /** ***********************************************************************
     * Get the context container of the currently active player.
     *
     * Game will always contain a context container for each player. The active
     * context instance will be changed whenever the active player is changed.
     *
     * @returns {SpaceInvaders.PlayerContext} Context of the active player.
     */
    getActiveContext() {
        return (this.activePlayer == 1 ? this.player1Context : this.player2Context);
    }

    getPlayer1Context() { return this.player1Context; }
    getPlayer2Context() { return this.player2Context; }

    getHiScore() { return this.hiScore; }
    getSpriteSheet() { return this.spriteSheet; }
    getPlayerCount() { return this.playerCount; }
    getActivePlayer() { return this.activePlayer; }
    getCanvasCtx() { return this.ctx; }
    setHiScore(newScore) { this.hiScore = newScore; }
    setPlayerCount(newCount) { this.playerCount = newCount; }

}

module.exports = Game;
