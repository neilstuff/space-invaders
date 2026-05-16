/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);

	document.addEventListener('dragover', event => event.preventDefault());
	document.addEventListener('drop', event => event.preventDefault());

	(new Game()).start();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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


	var Constants = __webpack_require__(2);
	var SpaceInvaders = __webpack_require__(3);
	var Scene = __webpack_require__(4);
	var PlayerContext = __webpack_require__(7);
	var WelcomeState = __webpack_require__(8);
	var PlayPlayerState = __webpack_require__(11);

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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	class Constants {

	  /** A constant definition for the canvas element ID. */
	  static get CANVAS_ID() { return "game-canvas"; }

	  /** A constant definition for the game framerate. */
	  static get FPS() { return (1000.0 / 60.0); }

	  /** A constant for the number one keycode. */
	  static get KEY_1() { return (49); }

	  /** A constant for the number two keycode. */
	  static get KEY_2() { return (50); }

	  /** A constant for the right-arrow keycode. */
	  static get KEY_RIGHT() { return (39); }

	  /** A constant for the left-arrow keycode. */
	  static get KEY_LEFT() { return (37); }

	  /** A constant for the spacebar keycode. */
	  static get KEY_SPACEBAR() { return (32); }

	  /** A constant for the enter keycode. */
	  static get KEY_ENTER() { return (13); }

	  constructor() {}

	}

	module.exports = Constants;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/** A namespace for the Space Invaders game. */
	class SpaceInvaders {

	    /** *************************************************************************
	     * A helper utility to create a four digit string from the given score.
	     *
	     * Four digit string is ensured by prepending additional zeroes to the given
	     * value when necessary. For example value 12 is transformed to "0012" string.
	     *
	     * @param {number} score The score to be converted into a string.
	     */

	    static toScoreString(score) {
	        var result = "NaN";
	        if (typeof score == 'number') {
	            result = score.toString();
	            var difference = (4 - result.length);
	            if (difference >= 0) {
	                result = "0000" + result;
	            }
	            result = result.substring(result.length - 4);
	        }
	        return result;

	    }

	    constructor() {
	    }

	}

	module.exports = SpaceInvaders;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var SpaceInvaders = __webpack_require__(3);
	var TextEntity = __webpack_require__(5);
	var SpaceInvaders = __webpack_require__(3);

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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var Entity = __webpack_require__(6);

	class TextEntity extends Entity {

	    /** A constant default value for the text to be drawn. */
	    static get DEFAULT_TEXT() { return ""; }

	    /** A constant default fill style (i.e. color) for the text. */
	    static get DEFAULT_FILL_STYLE() { return "white"; }

	    /** A constant default font definition for the text. */
	    static get DEFAULT_FONT() { return "24pt monospace"; }

	    /** A constant default text alignment for the rendering. */
	    static get DEFAULT_ALIGN() { return "start"; }

	    /** A constant default visibility state for the text. */
	    static get DEFAULT_VISIBLE() { return true; }

	    /** A constant amount of toggles to perform after #blink is called. */
	    static get DEFAULT_BLINK_COUNT() { return 30; }

	    /** A constant amount of updates (i.e. interval) between the blinking. */
	    static get DEFAULT_BLINK_FREQUENCY() { return 5; }

	    /** ***************************************************************************
	     * A textual entity for all texts used in the Space Invaders game.
	     *
	     * This class presents a textual entity within the game scene. It does really
	     * an encapsulation of the 2d drawing context textual presentation functions.
	     *
	     * @param {SpaceInvaders.Game} game A reference to the target game instance.
	     */
	    constructor(game) {
	        super(game)

	        /** The text to be rendered. */
	        this.text = TextEntity.DEFAULT_TEXT;
	        /** The fill style (i.e. color) used to draw the text. */
	        this.fillStyle = TextEntity.DEFAULT_FILL_STYLE;
	        /** The target font description i.e. size, font family, etc. */
	        this.font = TextEntity.DEFAULT_FONT;
	        /** The text align definition (start|end|center|left|right). */
	        this.align = TextEntity.DEFAULT_ALIGN;
	        /** The definition whether the entity should be rendered. */
	        this.visible = TextEntity.DEFAULT_VISIBLE;
	        /** The amount of remaining blinks (visible/invisible toggles). */
	        this.blinks = 0;
	        /** The blink timer that will perform the blink frequency calculation. */
	        this.blinkTimer = 0;
	        /** Amount of blinks to be perfomed after #blink is called (-1: infinite).*/
	        this.blinkCount = TextEntity.DEFAULT_BLINK_COUNT;
	        /** The amount of updates (i.e. interval) between the blinks. */
	        this.blinkFrequency = TextEntity.   DEFAULT_BLINK_FREQUENCY;

	    }

	    /** *************************************************************************
	     * Update (i.e. tick) the the logic within the entity.
	     * @param {double} dt The delta time from the previous tick operation.
	     */
	    update(dt) {
	        if (this.blinks > 0 || this.blinks == -1) {
	            this.blinkTimer--;
	            if (this.blinkTimer == 0) {
	                this.setVisible(!this.isVisible());
	                this.blinks--;
	                this.blinks = Math.max(this.blinks, -1);
	                if (this.blinks > 0 || this.blinks == -1) {
	                    this.blinkTimer = this.blinkFrequency;
	                }
	            }
	        }
	    }

	    /** *************************************************************************
	     * Render (i.e. draw) the text on the screen.
	     * @param {CanvasRenderingContext2D} ctx The drawing context to use.
	     */
	    render(ctx) {
	        if (this.isVisible()) {
	            ctx.fillStyle = this.getFillStyle();
	            ctx.textAlign = this.getAlign();
	            ctx.font = this.getFont();
	            ctx.fillText(this.getText(), this.getX(), this.getY());
	        }

	    }

	    /** *************************************************************************
	     * Start blinking (i.e. toggling visible/invisible).
	     *
	     * After this function is called, the target entity will start to blink if it
	     * is currently visible. If the entity is already blinking then the amount of
	     * remaining blinks will be reset back to the amount of the this.BLINK_COUNT.
	     */
	    blink() {
	        if (this.isVisible() || this.blinks > 0) {
	            this.setVisible(true);
	            this.blinks = this.getBlinkCount();
	            this.blinkTimer = this.getBlinkFrequency();
	        }
	    }

	    getText() { return this.text; }
	    getFillStyle() { return this.fillStyle; }
	    getFont() { return this.font; }
	    getAlign() { return this.align; }
	    isVisible() { return this.visible; }
	    getBlinkCount() { return this.blinkCount; }
	    getBlinkFrequency() { return this.blinkFrequency; }

	    setText(newText) { this.text = newText; }
	    setFillStyle(newStyle) { this.fillStyle = newStyle; }
	    setFont(newFont) { this.font = newFont; }
	    setAlign(newAlign) { this.align = newAlign; }
	    setVisible(newVisible) { this.visible = newVisible; }
	    setBlinkCount(newCount) { this.blinkCount = newCount; }
	    setBlinkFrequency(newFreq) { this.blinkFrequency = newFreq; }
	}

	module.exports = TextEntity;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var Constants = __webpack_require__(2);

	class Entity extends Constants {

	    /** A constant default value for the y-position. */
	    static get DEFAULT_EXTENT_X() { return 0; }

	    /** A constant default value for the y-position. */
	    static get DEFAULT_Y() { return 0; }

	    /** ***************************************************************************
	     * An entity abstraction for all game objects within the Space Invaders game.
	     *
	     * This class acts as the root of all entities within the game scene. It does
	     * contain all the shared definitions that must be present within all entities
	     * that are created into the game scene. This also includes the root game and
	     * scene instances as well as the 2d-coordinates of the entity.
	     *
	     * @param {SpaceInvaders.Game} game A reference to the target game instance.
	     */
	    constructor(game) {
	        super();
	        /** A reference to the root game instance. */
	        this.game = game;
	        /** A reference to the used scene instance. */
	        this.scene = game.getScene();
	        /** The x-coordinate position of the entity. */
	        this.x = this.DEFAULT_X;
	        /** The y-coordinate position of the entity. */
	        this.y = this.DEFAULT_Y;
	    }

	    getX() { return this.x; }
	    getY() { return this.y; }

	    setX(newX) { this.x = newX; }
	    setY(newY) { this.y = newY; }
	}

	module.exports = Entity;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	class PlayerContext {
	    static get INITIAL_LIVE_COUNT() { return 3; }

	    constructor(game) {
	        /** A reference to the root game instance. */
	        this.game = game;

	        /** The current level of the player. */
	        this.level = 1;

	        /** The current score of the player. */
	        this.score = 0;

	        /** The current amount of player lives. */
	        this.lives = PlayerContext.INITIAL_LIVE_COUNT;

	        /** The previous state of the aliens within the game. */
	        this.alienStates = undefined;

	        /** The previous state of the shields within the game. */
	        this.shieldStates = undefined;


	    }
	    /** *************************************************************************
	     * Reset the context back to the original state.
	     *
	     * This function is used to reset the context to contain the initial values
	     * for each of the contained value. Useful for example, when the game is over
	     * and a new game should be started.
	     */


	    reset() {
	        this.level = 1;
	        this.score = 0;
	        this.lives = this.INITIAL_LIVE_COUNT;
	        this.shieldStates = undefined;
	        this.alienStates = undefined;
	    }

	    getLevel() { return this.level; }
	    getScore() { return this.score; }
	    getLives() { return this.lives; }
	    getAlienStates() { return this.alienStates; }
	    getShieldStates() { return this.shieldStates; }

	    setLevel(newLevel) { this.level = newLevel; }
	    setScore(newScore) { this.score = newScore; }
	    setLives(newLives) { this.lives = newLives; }
	    setAlienStates(newStates) { this.alienStates = newStates; }
	    setShieldStates(newStates) { this.shieldStates = newStates; }

	    addScore(additionalScore) { this.score += additionalScore; }

	}

	module.exports = PlayerContext;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var Constants = __webpack_require__(2);
	var TextEntity = __webpack_require__(5);
	var SpriteEntity = __webpack_require__(9);
	var Game = __webpack_require__(1);
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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var CollideableEntity = __webpack_require__(10);

	class SpriteEntity extends CollideableEntity {
	    /** A constant default for the sprite width. */
	    static get DEFAULT_WIDTH() { return 0; }
	    /** A constant default for the sprite height. */
	    static get DEFAULT_HEIGHT() { return 0; }
	    /** A constant default for the sprite clipping x-coordinate. */
	    static get DEFAULT_CLIP_X() { return 0; }
	    /** A constant default for the sprite clipping y-coordinate. */
	    static get DEFAULT_CLIP_Y() { return 0; }
	    /** A constant default for the sprite image. */
	    static get DEFAULT_IMAGE() { return undefined; }
	    /** A constant default for the sprite visibility. */
	    static get DEFAULT_VISIBLE() { return true; }

	    /** ***************************************************************************
	     * A sprite entity for image sprites for the Space Invaders game.
	     *
	     * This entity presents a drawable sprite entity that is drawn from an external
	     * image file provided with the #setImage function. Note that it is typically
	     * a good idea to put all sprites in a single sprite sheet so the same image is
	     * being loaded only once and can be therefore used with all sprites.
	     *
	     * @param {Game} game A reference to the root game instance.
	     */
	    constructor(game) {
	        super(game);

	        /** The width of the sprite. */
	        this.width = SpriteEntity.DEFAULT_WIDTH;
	        /** The height of the sprite. */
	        this.height = SpriteEntity.DEFAULT_HEIGHT;
	        /** The clipping x-coordinate of the image. */
	        this.clipX = SpriteEntity.DEFAULT_CLIP_X;
	        /** The clipping y-coordinate of the image. */
	        this.clipY = SpriteEntity.DEFAULT_CLIP_Y;
	        /** The source image to render sprite from. */
	        this.image = SpriteEntity.DEFAULT_IMAGE;
	        /** The definition whether the sprite is visible. */
	        this.visible = SpriteEntity.DEFAULT_VISIBLE;

	        /** Ensure initial parent collideable boundary x-axis. */
	        this.setExtentX(this.width / 2);
	        /** Ensure initial parent collideable boundary y-axis. */
	        this.setExtentY(this.height / 2);
	        
	    }

	    render(ctx) {
	        if (this.image && this.isVisible()) {
	            ctx.drawImage(this.image,
	                this.getClipX(),
	                this.getClipY(),
	                this.getWidth(),
	                this.getHeight(),
	                this.getX(),
	                this.getY(),
	                this.getWidth(),
	                this.getHeight());
	        }
	    }

	    setWidth(newWidth) {
	        this.width = newWidth;
	        this.setExtentX(this.width / 2);
	    }

	    setHeight(newHeight) {
	        this.height = newHeight;
	        this.setExtentY(this.height / 2);
	    }

	    getWidth() { return this.width; }
	    getHeight() { return this.height; }
	    getClipX() { return this.clipX; }
	    getClipY() { return this.clipY; }
	    getImage() { return this.image; }
	    isVisible() { return this.visible; }
	    setClipX(newClip) { this.clipX = newClip; }
	    setClipY(newClip) { this.clipY = newClip; }
	    setImage(newImage) { this.image = newImage; }
	    setVisible(newVisible) { this.visible = newVisible; }

	}

	module.exports = SpriteEntity;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var Entity = __webpack_require__(6);

	class CollideableEntity extends Entity {

	    /** A constant default value for the AABB extent in the x-axis. */
	    static get DEFAULT_EXTENT_X() { return 0; }

	    /** A constant default value for the AABB extent in the y-axis. */

	    static get DEFAULT_EXTENT_Y() { return 0; }
	    /** A constant default value for the enabled state. */

	    static get DEFAULT_ENABLED() { return true; }

	    /** ***************************************************************************
	     * An entity abstraction for all entities that are collideable.
	     *
	     * This class encapsulates the required definitions for an entity to perform a
	     * collision check with an another entity. The abstraction uses an axis-aligned
	     * bounding box to encapsulate and check whether a collision is executed.
	     *
	     * @param {Game} game A reference to the target game instance.
	     */

	    constructor(game) {
	        super(game);

	        /** The AABB x-axis extent (i.e. half-width). */
	        this.extentX = CollideableEntity.DEFAULT_EXTENT_X;
	        /** The AABB y-axis extent (i.e. half-height). */
	        this.extentY = CollideableEntity.DEFAULT_EXTENT_Y;
	        /** The x-axis center of the AABB. */
	        this.centerX = this.getX() + this.extentX;
	        /** The y-axis center of the AABB. */
	        this.centerY = this.getY() + this.extentY;
	        /** The definition whether the entity can be collided. */
	        this.enabled = CollideableEntity.DEFAULT_ENABLED;
	        /** A stored reference to the original parent x-axis setter. */
	        this.parentSetX = super.setX;
	        /** A stored reference to the original parent y-axis setter. */
	        this.parentSetY = super.setY;
	    }

	    /****************************************************************************
	     * Check whether this entity collides with an another entity.
	     * @param {SpaceInvades.CollideableEntity} o Another entity to check against.
	     */
	    collides(o) {
	        // no collision if either entity is currently not collideable.
	        if (!this.isEnabled() || !o.isEnabled()) return false;

	        // check whether we have a collisions between the two AABBs.
	        var x = Math.abs(this.getCenterX() - o.getCenterX()) < (this.getExtentX() + o.getExtentX());
	        var y = Math.abs(this.getCenterY() - o.getCenterY()) < (this.getExtentY() + o.getExtentY());

	        return x && y;
	        
	    }

	    /****************************************************************************
	     * Check whether this entity contains the specified pixel.
	     * @param {number} x The x-coordinate of the pixel.
	     * @param {number} y The y-coordinate of the pixel.
	     * @returns {boolean} Boolean indivating whether pixel is included.
	     */
	    containsPixel(x, y) {
	        return !(x < (this.getCenterX() - this.getExtentX()) ||
	            x > (this.getCenterX() + this.getExtentX()) ||
	            y < (this.getCenterY() - this.getExtentY()) ||
	            y > (this.getCenterY() + this.getExtentY()));
	    }

	    setX(newX) {
	        this.parentSetX(newX);
	        this.centerX = this.getX() + this.extentX;
	    }

	    setY(newY) {
	        this.parentSetY(newY);
	        this.centerY = this.getY() + this.extentY;
	    }

	    setExtentX(newExtent) {
	        this.extentX = newExtent;
	        this.centerX = this.getX() + this.extentX;
	    }

	    setExtentY(newExtent) {
	        this.extentY = newExtent;
	        this.centerY = this.getY() + this.extentY;
	    }

	    getExtentX() { return this.extentX; }
	    getExtentY() { return this.extentY; }
	    getCenterX() { return this.centerX; }
	    getCenterY() { return this.centerY; }
	    isEnabled() { return this.enabled; }

	    setEnabled(newEnabled) { this.enabled = newEnabled; }

	}

	module.exports = CollideableEntity;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var TextEntity = __webpack_require__(5);
	var Controller = __webpack_require__(12);
	var Game = __webpack_require__(1);

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


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var Constants = __webpack_require__(2);
	var SpriteEntity = __webpack_require__(9);
	var AvatarEntity = __webpack_require__(13);
	var AvatarLaser = __webpack_require__(16);
	var TextEntity = __webpack_require__(5);
	var CollideableEntity = __webpack_require__(10);
	var AnimatedMovableSpriteEntity = __webpack_require__(14);
	var AlienShotEntity = __webpack_require__(17);
	var Shield = __webpack_require__(18);
	var Game = __webpack_require__(1);

	class Controller extends Constants {

	    /** A constant starting step size for the aliens. */
	    static get ALIEN_START_STEP_SIZE() { return 55; }
	    /** A constant amount to decrement step size on each collided alien. */
	    static get ALIEN_STEP_DECREMENT_SIZE() { return 1; }

	    /** A constant index for the plunger shot column array start index. */
	    static get ALIEN_PLUNGER_SHOT_START_INDEX() { return 0; }
	    /** A constant index for the squiggly shot column array start index.  */
	    static get ALIEN_SQUIGGLY_SHOT_START_INDEX() { return 6; }
	    /** A constant amount of shot indices per shot type (round-robin). */
	    static get ALIEN_SHOT_INDICE_COUNT() { return 15; }

	    /** A constant time interval between appending the flying saucer. */
	    static get FLYING_SAUCER_INTERVAL() { return 1200; }
	    /** A time that is waited after player avatar gets destroyed. */
	    static get RELAUNCH_WAIT_TIME() { return 150; }

	    /** *************************************************************************
	     * The ingame state for the Space Invaders game.
	     *
	     * This is the state where the player(s) actually play the game. Here we allow
	     * users to move and fire with the turret so they can prevent the earth from
	     * being invaded by the invaders coming from the space.
	     *
	     * @param {Game} game A reference to the root game instance.
	     */
	    constructor(game) {
	        super();

	        /** A reference to the root game instance. */
	        this.game = game;
	        /** A reference to the currently active player context. */
	        this.ctx = game.getActiveContext();

	        this.footerLine;
	        this.avatar;
	        this.avatarLaser;
	        this.avatarLaserCount;
	        this.lifesText;
	        this.lifeSprites;
	        this.gameOverText;
	        this.gameOverInstructions;

	        this.leftOutOfBoundsDetector;
	        this.rightOutOfBoundsDetector;
	        this.topOutOfBoundsDetector;

	        this.aliens;
	        this.alienLeftBoundsDetector;
	        this.alienRightBoundsDetector;
	        this.alienShots;

	        this.flyingSaucer;
	        /** The counter to count when the flying saucer is launched. */
	        this.flyingSaucerCounter = Controller.FLYING_SAUCER_INTERVAL;
	        /** The flying saucer point table used along with player shot counter. */
	        this.flyingSaucerPointTable = [
	            100, 50, 50, 100, 150, 100, 100, 50, 300, 100, 100, 100, 50, 150, 100
	        ];

	        /** The current shot column index of the plunger shot.  */
	        this.alienPlungerShotColumnIndice = Controller.ALIEN_PLUNGER_SHOT_START_INDEX;

	        console.log(`Initialized alien plunger shot column index: ${this.alienPlungerShotColumnIndice}`);
	        /** The current shot column index of the squiggly shot. */
	        this.alienSquigglyShotColumnIndice = Controller.ALIEN_SQUIGGLY_SHOT_START_INDEX;
	        /** The column indices used to define where to shoot the alien missiles. */
	        this.alienShotColumn = [
	            0, 6, 0, 0, 0, 3, 10, 0, 5, 2, 0, 0, 10, 8, 1, 7, 1, 10, 3, 6, 9
	        ];
	        /** A lock used to prevent rolling shot to be created constantly. */
	        this.alienRollingShotLock = 0;

	        /** A counter used to wait before re-launching the game after avatar destruction. */
	        this.relaunchCounter = 0;

	        this.shields;
	        // initialize the green static footer line at the bottom of the screen.
	        this.footerLine = new SpriteEntity(game);
	        this.footerLine.setImage(game.getSpriteSheet());
	        this.footerLine.setX(0);
	        this.footerLine.setY(717);
	        this.footerLine.setWidth(672);
	        this.footerLine.setHeight(3);
	        this.footerLine.setClipX(0);
	        this.footerLine.setClipY(117);

	        // initialize the green avatar moved by the player.

	        this.avatar = new AvatarEntity(game, this);
	        this.avatar.setImage(game.getSpriteSheet());
	        this.avatar.setWidth(40);
	        this.avatar.setHeight(24);
	        this.avatar.setX(45);
	        this.avatar.setY(648);
	        this.avatar.setVelocity(0.25);
	        this.avatar.addAnimationFrame(86, 5, 40, 24);
	        this.avatar.setAnimationFrameIndex(0);

	        // initialize a single laser for the avatar.
	        // we can reuse the same laser instance for the avatar.
	        this.avatarLaser = new AvatarLaser(game);
	        this.avatarLaser.setImage(game.getSpriteSheet());
	        this.avatarLaser.setWidth(6);
	        this.avatarLaser.setHeight(9);
	        this.avatarLaser.setX(0);
	        this.avatarLaser.setY(0);
	        this.avatarLaser.setVelocity(0.75);
	        this.avatarLaser.setDirectionY(-1);
	        this.avatarLaser.setVisible(false);
	        this.avatarLaser.setEnabled(false);
	        this.avatarLaser.addAnimationFrame(80, 36, 6, 9);
	        this.avatarLaser.addAnimationFrame(131, 5, 39, 24);
	        this.avatarLaser.addAnimationFrame(175, 5, 39, 24);
	        this.avatarLaser.addAnimationFrame(251, 37, 24, 24);
	        this.avatarLaser.setAnimationStepSize(0);
	        this.avatarLaser.setAnimationFrameIndex(0);
	        this.avatarLaserCount = 0;

	        // get the amount of lives for the current player.
	        var lives = this.ctx.getLives();

	        // initialize the text indicating the amount lifes.
	        this.lifesText = new TextEntity(game);
	        this.lifesText.setText(lives.toString());
	        this.lifesText.setX(27);
	        this.lifesText.setY(743);

	        // initialize the sprites describing the reserved lives.
	        this.lifeSprites = [];
	        for (var i = 0; i < (lives - 1); i++) {

	            var sprite = new SpriteEntity(game);
	            sprite.setImage(game.getSpriteSheet());
	            sprite.setWidth(40);
	            sprite.setHeight(24);
	            sprite.setX(66 + i * 49);
	            sprite.setY(720);
	            sprite.setClipX(85);
	            sprite.setClipY(5);
	            this.lifeSprites.push(sprite);
	        }

	        // initialize the text that indicates that the game has ended.
	        this.gameOverText = new TextEntity(game);
	        this.gameOverText.setAlign("center");
	        this.gameOverText.setFillStyle("#f50305");
	        this.gameOverText.setText("GAME OVER");
	        this.gameOverText.setVisible(false);
	        this.gameOverText.setX(672 / 2);
	        this.gameOverText.setY(135);

	        // initialize the text that indicates how to continue from game over.
	        this.gameOverInstructions = new TextEntity(game);
	        this.gameOverInstructions.setAlign("center");
	        this.gameOverInstructions.setFillStyle("#f50305");
	        this.gameOverInstructions.setText("PRESS ENTER TO CONTINUE");
	        this.gameOverInstructions.setVisible(false);
	        this.gameOverInstructions.setX(672 / 2);
	        this.gameOverInstructions.setY(this.gameOverText.getY() + 40);
	        // initialize an out-of-bounds detector at the left side of the scene.
	        this.leftOutOfBoundsDetector = new CollideableEntity(game);
	        this.leftOutOfBoundsDetector.setX(-100);
	        this.leftOutOfBoundsDetector.setY(0);
	        this.leftOutOfBoundsDetector.setExtentX(50);
	        this.leftOutOfBoundsDetector.setExtentY(768 / 2);

	        // initialize an out-of-bounds detector at the right side of the scene.
	        this.rightOutOfBoundsDetector = new CollideableEntity(game);
	        this.rightOutOfBoundsDetector.setX(672);
	        this.rightOutOfBoundsDetector.setY(0);
	        this.rightOutOfBoundsDetector.setExtentX(50);
	        this.rightOutOfBoundsDetector.setExtentY(768 / 2);

	        // initialize an out-of-bounds detector at the top of the scene.
	        this.topOutOfBoundsDetector = new CollideableEntity(game);
	        this.topOutOfBoundsDetector.setX(0);
	        this.topOutOfBoundsDetector.setY(0);
	        this.topOutOfBoundsDetector.setExtentX(768 / 2);
	        this.topOutOfBoundsDetector.setExtentY(45);

	        // initialize the flying saucer at the top-right of the screen.
	        this.flyingSaucer = new AnimatedMovableSpriteEntity(game);
	        this.flyingSaucer.setImage(game.getSpriteSheet());
	        this.flyingSaucer.setVelocity(0.15);
	        this.flyingSaucer.setEnabled(false);
	        this.flyingSaucer.setVisible(false);
	        this.flyingSaucer.setX(672 - 43);
	        this.flyingSaucer.setY(115);
	        this.flyingSaucer.setWidth(43);
	        this.flyingSaucer.setHeight(19);
	        this.flyingSaucer.addAnimationFrame(5, 91, 43, 19)
	        this.flyingSaucer.addAnimationFrame(54, 91, 66, 24);
	        this.flyingSaucer.setAnimationFrameIndex(0);

	        // initialize aliens.
	        this.constructAliens();

	        // initialize the left alien director for alien and avatar movement restrictions.
	        this.alienLeftBoundsDetector = new CollideableEntity(game);
	        this.alienLeftBoundsDetector.setX(-45);
	        this.alienLeftBoundsDetector.setY(0);
	        this.alienLeftBoundsDetector.setExtentX(45);
	        this.alienLeftBoundsDetector.setExtentY(768 / 2);

	        // initialize the right alien director for alien and avatar movement restrictions.
	        this.alienRightBoundsDetector = new CollideableEntity(game);
	        this.alienRightBoundsDetector.setX(672 - 45);
	        this.alienRightBoundsDetector.setY(0);
	        this.alienRightBoundsDetector.setExtentX(45);
	        this.alienRightBoundsDetector.setExtentY(768 / 2);
	        // ===============
	        // = ALIEN SHOTS =
	        // ===============

	        // initialize the rolling (i.e. homing) alien shot.
	        this.rollingShot = new AlienShotEntity(game, this);
	        this.rollingShot.setImage(game.getSpriteSheet());
	        this.rollingShot.setWidth(9);
	        this.rollingShot.setHeight(21);
	        this.rollingShot.setVelocity(0.2);
	        this.rollingShot.setDirectionY(1);
	        this.rollingShot.addAnimationFrame(149, 37, 9, 21);
	        this.rollingShot.addAnimationFrame(163, 37, 9, 21);
	        this.rollingShot.addAnimationFrame(149, 37, 9, 21);
	        this.rollingShot.addAnimationFrame(178, 37, 9, 21);
	        this.rollingShot.setAnimationFrameIndex(0);
	        this.rollingShot.setAnimationStepSize(4);
	        this.rollingShot.setVisible(false);
	        this.rollingShot.setEnabled(false);

	        // initialize the plunger alien shot.
	        this.plungerShot = new AlienShotEntity(game, this);
	        this.plungerShot.setImage(game.getSpriteSheet());
	        this.plungerShot.setWidth(9);
	        this.plungerShot.setHeight(18);
	        this.plungerShot.setVelocity(0.2);
	        this.plungerShot.setDirectionY(1);
	        this.plungerShot.addAnimationFrame(93, 37, 9, 21);
	        this.plungerShot.addAnimationFrame(107, 37, 9, 21);
	        this.plungerShot.addAnimationFrame(121, 37, 9, 21);
	        this.plungerShot.addAnimationFrame(135, 37, 9, 21);
	        this.plungerShot.setAnimationFrameIndex(0);
	        this.plungerShot.setAnimationStepSize(4);
	        this.plungerShot.setVisible(false);
	        this.plungerShot.setEnabled(false);

	        // initialize the squiggly alien shot.
	        this.squigglyShot = new AlienShotEntity(game, this);
	        this.squigglyShot.setImage(game.getSpriteSheet());
	        this.squigglyShot.setWidth(9);
	        this.squigglyShot.setHeight(21);
	        this.squigglyShot.setVelocity(0.2);
	        this.squigglyShot.setDirectionY(1);
	        this.squigglyShot.addAnimationFrame(191, 37, 9, 21);
	        this.squigglyShot.addAnimationFrame(206, 37, 9, 21);
	        this.squigglyShot.addAnimationFrame(221, 37, 9, 21);
	        this.squigglyShot.addAnimationFrame(236, 37, 9, 21);
	        this.squigglyShot.setAnimationFrameIndex(0);
	        this.squigglyShot.setAnimationStepSize(4);
	        this.squigglyShot.setVisible(false);
	        this.squigglyShot.setEnabled(false);

	        // initialize the array of alien shots.
	        this.alienShots = [];
	        this.alienShots.push(this.rollingShot);
	        this.alienShots.push(this.plungerShot);
	        this.alienShots.push(this.squigglyShot);

	        // construct the four avatar shields for the player.
	        this.constructShields();

	    }

	    getAlienReloadRate() {
	        // return a reload rate based on the current score.
	        var currentScore = this.ctx.getScore();
	        if (currentScore <= 200) {
	            return 48;
	        } else if (currentScore <= 1000) {
	            return 16;
	        } else if (currentScore <= 2000) {
	            return 11;
	        } else if (currentScore <= 3000) {
	            return 8;
	        } else {
	            return 7;
	        }
	    }

	    getAlienStartY() {
	        // return the topmost alien starting y-position based on the current level.
	        var level = Math.max(1, (this.ctx.getLevel() % 10));
	        var start = 192;

	        if (level > 1) {
	            start += 48;
	        }
	        if (level > 2) {
	            start += 24;
	        }
	        if (level > 3) {
	            start += 24;
	        }
	        if (level > 5) {
	            start += 24;
	        }

	        return start;
	    }

	    constructAliens() {
	        this.aliens = this.ctx.getAlienStates();

	        if (this.aliens == undefined) {
	            this.aliens = [];
	            var startRow = this.getAlienStartY();
	            for (var row = 0; row < 5; row++) {
	                var y = startRow + (24 * 2 * row);
	                var x = 66;
	                for (var col = 0; col < 11; col++) {
	                    var alien = new AnimatedMovableSpriteEntity(this.game);
	                    alien.setImage(this.game.getSpriteSheet());
	                    alien.setDirectionX(1);
	                    alien.setVelocity(0.4);
	                    alien.setAnimationStepSize(Controller.ALIEN_START_STEP_SIZE);
	                    alien.setStepSize(Controller.ALIEN_START_STEP_SIZE);
	                    alien.setY(y);
	                    alien.setHeight(24);
	                    if (row == 0) {
	                        alien.setWidth(24);
	                        alien.setX(x + 6 + (col * 2 * 24));
	                        alien.addAnimationFrame(5, 62, 24, 24);
	                        alien.addAnimationFrame(34, 62, 24, 24);
	                    } else if (row < 3) {
	                        alien.setWidth(33);
	                        alien.setX(x + 1 + (col * 2 * 24));
	                        alien.addAnimationFrame(5, 33, 33, 24);
	                        alien.addAnimationFrame(43, 33, 33, 24);
	                    } else {
	                        alien.setWidth(36);
	                        alien.setX(x + (col * 2 * 24));
	                        alien.addAnimationFrame(5, 5, 36, 24);
	                        alien.addAnimationFrame(46, 5, 36, 24);
	                    }
	                    alien.setAnimationFrameIndex(0);
	                    this.aliens.push(alien);
	                }
	            }
	        }
	    }

	    constructShields() {
	        this.shields = this.ctx.getShieldStates();

	        if (this.shields == undefined) {
	            var shield1 = new Shield(this.game);
	            shield1.setImage(this.game.getSpriteSheet());
	            shield1.setWidth(66);
	            shield1.setHeight(48);
	            shield1.setClipX(293);
	            shield1.setClipY(5);
	            shield1.setX(135 - shield1.getWidth() / 2);
	            shield1.setY(575);

	            var shield2 = new Shield(this.game);
	            shield2.setImage(this.game.getSpriteSheet());
	            shield2.setWidth(66);
	            shield2.setHeight(48);
	            shield2.setClipX(293);
	            shield2.setClipY(5);
	            shield2.setX(269 - shield2.getWidth() / 2);
	            shield2.setY(575);

	            var shield3 = new Shield(this.game);
	            shield3.setImage(this.game.getSpriteSheet());
	            shield3.setWidth(66);
	            shield3.setHeight(48);
	            shield3.setClipX(293);
	            shield3.setClipY(5);
	            shield3.setX(403 - shield3.getWidth() / 2);
	            shield3.setY(575);

	            var shield4 = new Shield(this.game);
	            shield4.setImage(this.game.getSpriteSheet());
	            shield4.setWidth(66);
	            shield4.setHeight(48);
	            shield4.setClipX(293);
	            shield4.setClipY(5);
	            shield4.setX(537 - shield4.getWidth() / 2);
	            shield4.setY(575);

	            this.shields = [];
	            this.shields.push(shield1);
	            this.shields.push(shield2);
	            this.shields.push(shield3);
	            this.shields.push(shield4);

	        }

	    }

	    getAlienShots() { return this.alienShots; }

	    startRelaunchCounter() {
	        this.relaunchCounter = Controller.RELAUNCH_WAIT_TIME;
	    }

	    /** *************************************************************************
	     * Decrement the current amoun of player lives for the target player.
	     *
	     * This function is used to perform all necessary operations to decrement
	     * the amount of lives for the target player. It updates the global lives
	     * count and also ensures that the visual presentation is being updated.
	     *
	     * @param {number} playerIndex The index of the target player.
	     */
	    decrementPlayerLives(playerIndex) {
	        // get the current amount of lives of the target player.
	        var lives = this.ctx.getLives();

	        // decrement the amount of lives by one.
	        lives = Math.max(0, lives - 1);

	        // set the new lives amount for the target player.
	        this.ctx.setLives(lives);

	        // update the visual presentations of the current lives.
	        this.lifesText.setText(lives.toString());
	        if (this.lifeSprites.length > 0) {
	            this.lifeSprites[Math.max(0, lives - 1)].setVisible(false);
	        }
	    }

	    update(dt) {
	        console.log(`Controller alienPlungerShotColumnIndice: ${this.alienPlungerShotColumnIndice} : ${this.alienSquigglyShotColumnIndice}`);
	        // skip logical updates if the game has ended.
	        if (this.gameOverText.isVisible()) {
	            return;
	        }

	        // decrement relaunch counter if launched or handle destruction state.
	        if (this.relaunchCounter > 0) {
	            this.relaunchCounter--;
	        } else if (this.avatar.isEnabled() == false) {
	            var playerCount = this.game.getPlayerCount();
	            if (playerCount == 1) {
	                // check whether it's time end game or reset the avatar.
	                if (this.ctx.getLives() == 0) {
	                    // check and update hi-score if necessary.
	                    var score = this.ctx.getScore();
	                    if (score > this.game.getHiScore()) {
	                        this.game.setHiScore(score);
	                    }

	                    // show the game over text.
	                    this.gameOverText.setVisible(true);
	                    this.gameOverInstructions.setVisible(true);
	                } else {
	                    this.avatar.reset();
	                }
	            } else {
	                // multi-player mode:
	                this.ctx.setAlienStates(aliens);
	                this.ctx.setShieldStates(shields);
	                var playerIndex = this.game.getActivePlayer();
	                if (playerIndex == 1) {
	                    this.game.setActivePlayer(2);
	                    var scene = this.game.getScene();
	                    var state = new PlayPlayerState(this.game);
	                    scene.setState(state);
	                } else {
	                    // check whether the game should end.
	                    var player1Ctx = this.game.getPlayer1Context();
	                    var player2Ctx = this.game.getPlayer2Context();
	                    if (player2Ctx.getLives() == 0) {
	                        // check and update hi-score if necessary.
	                        var score = player1Ctx.getScore();
	                        if (score > this.game.getHiScore()) {
	                            game.setHiScore(score);
	                        }

	                        // check and update hi-score if necessary.
	                        score = player2Ctx.getScore();
	                        if (score > this.game.getHiScore()) {
	                            this.game.setHiScore(score);
	                        }

	                        // show the game over text and also the score for 1st player.
	                        this.gameOverText.setVisible(true);
	                        this.gameOverInstructions.setVisible(true);
	                        this.game.getScene().getScore1Text().setVisible(true);
	                    } else {
	                        this.game.setActivePlayer(1);
	                        var scene = this.game.getScene();
	                        var state = new PlayPlayerState(this.game);
	                        scene.setState(state);
	                    }
	                }
	            }
	        }

	        this.avatar.update(dt);
	        this.avatar.animate();

	        if (this.avatarLaser.isVisible()) {
	            this.avatarLaser.update(dt);
	        }

	        this.flyingSaucer.update(dt);

	        // check whether any of the aliens hit the alien movement bounds.
	        var aliensHitBounds = false;
	        for (var i = 0; i < this.aliens.length && !aliensHitBounds; i++) {
	            if (this.aliens[i].getDirectionX() > 0) {
	                if (this.alienRightBoundsDetector.collides(this.aliens[i])) {
	                    aliensHitBounds = true;
	                }
	            } else {
	                if (this.alienLeftBoundsDetector.collides(this.aliens[i])) {
	                    aliensHitBounds = true;
	                }
	            }
	        }

	        // animate and update the currently visible aliens.
	        var activeAlienCount = 0;

	        if (this.avatar.isEnabled()) {
	            for (var i = 0; i < this.aliens.length; i++) {
	                if (aliensHitBounds && this.aliens[i].getStepCounter()) {
	                    this.aliens[i].setDirectionX(-this.aliens[i].getDirectionX());
	                    this.aliens[i].setY(this.aliens[i].getY() + this.aliens[i].getHeight());
	                }
	                if (this.aliens[i].isVisible()) {
	                    activeAlienCount++;
	                    this.aliens[i].update(dt);
	                    this.aliens[i].animate();

	                    // check whether the alien has just landed.
	                    if (this.aliens[i].collides(this.footerLine)) {
	                        this.avatar.explode();
	                    }
	                }
	            }

	            // check whether all aliens are destroyed i.e. the level is cleared.
	            if (this.activeAlienCount <= 0) {
	                this.ctx.setLevel(this.ctx.getLevel() + 1);
	                var scene = game.getScene();
	                scene.setState(new PlayPlayerState(game));
	                return;
	            }
	        }

	        // check that the avatar cannot go out-of-bounds from the either side of the scene.
	        if (this.avatar.getDirectionX() == -1) {
	            if (this.alienLeftBoundsDetector.collides(this.avatar)) {
	                this.avatar.setDirectionX(0);
	                this.avatar.setX(this.alienLeftBoundsDetector.getX() + 2 * this.alienLeftBoundsDetector.getExtentX());
	            }
	        } else if (this.avatar.getDirectionX() == 1) {
	            if (this.alienRightBoundsDetector.collides(this.avatar)) {
	                this.avatar.setDirectionX(0);
	                this.avatar.setX(this.alienRightBoundsDetector.getX() - this.avatar.getWidth());
	            }
	        }

	        // check and apply a state for the alien rolling missile.
	        if (this.avatar.isEnabled()) {
	            if (this.alienRollingShotLock > 0) {
	                this.alienRollingShotLock--;
	            }
	            
	            if (this.alienShots[0].isReadyToBeFired() && this.alienRollingShotLock <= 0) {
	                // find the nearest alien from the list of aliens.
	                var avatarX = this.avatar.getCenterX();
	                var alienIdx = -1;
	                var prevDistance = -1;
	                for (var col = 0; col < 11; col++) {
	                    var distance = Math.abs(this.aliens[col].getCenterX() - avatarX);
	                    if (prevDistance != -1 && distance > prevDistance) {
	                        break;
	                    }
	                    for (var row = 4; row >= 0; row--) {
	                        var idx = (row * 11) + col;

	                        console.log(`Checking alien at idx ${idx} with distance ${distance} and prevDistance ${prevDistance} and ${this.aliens == null ? 'aliens is null' : 'aliens is not null'} for rolling shot`);
	                        if (this.aliens[idx].isVisible()) {
	                            alienIdx = idx;
	                            prevDistance = distance;
	                            break;
	                        }
	                    }
	                }

	                if (alienIdx != -1) {
	                    this.alienShots[0].setX(this.aliens[alienIdx].getCenterX() - this.alienShots[0].getExtentX());
	                    this.alienShots[0].setY(this.aliens[alienIdx].getY() + this.aliens[alienIdx].getHeight());
	                    this.alienShots[0].fire();
	                }
	                this.alienRollingShotLock = this.getAlienReloadRate() * 4;
	            }
	        }

	        // ========================================================================
	        // create an alien plunger missile if it is being ready.
	        if (activeAlienCount > 1) {

	            console.log(`Alien length ${this.aliens.length} and alien shots length ${this.alienShots.length}`);
	            if (this.avatar.isEnabled() && this.alienShots[1].isReadyToBeFired()) {
	                // get the next target column and increment the column index pointer.
	               
	                console.log(`Plunger shot is ready to be fired. Current plunger shot column index: ${this.alienPlungerShotColumnIndice} ${this.aliens == null ? 'aliens is null' : 'aliens is not null'}`);

	                console.log(JSON.stringify(this.alienShotColumn));
	                var column = this.alienShotColumn[this.alienPlungerShotColumnIndice];
	                this.alienPlungerShotColumnIndice = (this.alienPlungerShotColumnIndice + 1);
	                this.alienPlungerShotColumnIndice = (this.alienPlungerShotColumnIndice % Controller.ALIEN_SHOT_INDICE_COUNT);

	                for (var n = 4; n >= 0; n--) {
	                    var idx = (n * 11) + column;
	                    console.log(`Firing plunger shot from alien ${this.avatar.isEnabled() ? 'enabled' : 'disabled'} ${this.alienShots[1].isReadyToBeFired() ? 'is ready' : 'is not ready'} at idx ${idx} at column ${column}`);
	                    if (this.aliens[idx].isVisible()) {
	                        // assign the position of the plunger shot based on the nearest alien.
	                        this.alienShots[1].setX(this.aliens[idx].getCenterX() - this.alienShots[1].getExtentX());
	                        this.alienShots[1].setY(this.aliens[idx].getY() + this.aliens[idx].getHeight());
	                        this.alienShots[1].fire();
	                        break;
	                    }
	                }
	            }
	        }

	        // decrement the flying saucer counter when the saucer is not visible.
	        if (this.flyingSaucer.isVisible() == false) {
	            this.flyingSaucerCounter--;
	        }

	        // ========================================================================
	        // create an flying saucer or an alien squiggly missile if it is being ready.
	        if (this.avatar.isEnabled() && this.flyingSaucer.isVisible() == false && this.alienShots[2].isReadyToBeFired()) {
	            // check whether it is time to launch the flying saucer.
	            if (this.flyingSaucerCounter <= 0 && this.activeAlienCount >= 8) {
	                // set saucer movement direction depending on the player shot count.
	                if ((this.avatarLaserCount % 2) == 0) {
	                    this.flyingSaucer.setDirectionX(-1);
	                    this.flyingSaucer.setX(672 - this.flyingSaucer.getWidth());
	                } else {
	                    this.flyingSaucer.setDirectionX(1);
	                    this.flyingSaucer.setX(0);
	                }

	                // enable saucer and reset saucer counter.
	                this.flyingSaucer.setEnabled(true);
	                this.flyingSaucer.setVisible(true);
	                this.flyingSaucer.setAnimationFrameIndex(0);
	                this.flyingSaucerCounter = Controller.FLYING_SAUCER_INTERVAL;
	            } else {
	                // get the next target column and increment the column index pointer.
	                var column = this.alienShotColumn[this.alienSquigglyShotColumnIndice];
	                this.alienSquigglyShotColumnIndice = (this.alienSquigglyShotColumnIndice + 1);
	                this.alienSquigglyShotColumnIndice = (this.alienSquigglyShotColumnIndice % Controller.ALIEN_SHOT_INDICE_COUNT);

	                for (var n = 4; n >= 0; n--) {
	                    var idx = (n * 11) + column;
	                    console.log(`Checking alien at idx ${idx} for squiggly shot at column ${column}`);
	                    if (this.aliens[idx].isVisible()) {
	                        // assign the position of the plunger shot based on the nearest alien.
	                        this.alienShots[2].setX(this.aliens[idx].getCenterX() - this.alienShots[2].getExtentX());
	                        this.alienShots[2].setY(this.aliens[idx].getY() + this.aliens[idx].getHeight());
	                        this.alienShots[2].fire();
	                        break;
	                    }
	                }
	            }
	        }

	        // animate, update and check collisions for all alien shots.
	        for (var i = 0; i < this.alienShots.length; i++) {
	            this.alienShots[i].animateAndUpdate(dt);
	            if (this.alienShots[i].collides(this.avatar)) {
	                // hide the shot and explode the avatar.
	                this.alienShots[i].setEnabled(false);
	                this.alienShots[i].setVisible(false);
	                this.avatar.explode();
	            } else if (this.alienShots[i].collides(this.footerLine)) {
	                // explode at the footer.
	                this.alienShots[i].explode();
	            } else if (this.alienShots[i].collides(this.avatarLaser)) {
	                // explode at the collision point.
	                this.alienShots[i].setEnabled(false);
	                this.alienShots[i].setVisible(false);
	                this.avatarLaser.explode();
	            } else {
	                // explode when a shield is being hit.
	                for (var j = 0; j < this.shields.length; j++) {
	                    this.shields[j].preciseCollides(this.alienShots[i]);
	                }
	            }
	        }

	        // animate and check whether the laser shot by the avatar hits something.
	        if (this.avatarLaser.isVisible()) {
	            this.avatarLaser.animate();
	            if (this.avatarLaser.collides(this.topOutOfBoundsDetector)) {
	                // stop the laser and change the image into the splash explosion image.
	                this.avatarLaser.setDirectionY(0);
	                this.avatarLaser.setAnimationFrameIndex(1);
	                this.avatarLaser.setY(this.topOutOfBoundsDetector.getY() + this.topOutOfBoundsDetector.getExtentY() * 2);
	                this.avatarLaser.setDisappearCountdown(15);
	            } else if (this.avatarLaser.collides(this.flyingSaucer)) {
	                // hide the avatar laser shot.
	                this.avatarLaser.setDirectionY(0);
	                this.avatarLaser.setEnabled(false);
	                this.avatarLaser.setVisible(false);

	                // change the flying saucer to perform a splash explosion.
	                this.flyingSaucer.setDirectionX(0);
	                this.flyingSaucer.setAnimationFrameIndex(1);
	                this.flyingSaucer.setDisappearCountdown(15);

	                // add points for the player depending on the shot count.
	                var score = this.flyingSaucerPointTable[this.avatarLaserCount % 15];
	                this.ctx.addScore(score);
	            } else {
	                // check whether player laser hits shields.
	                for (var i = 0; i < this.shields.length; i++) {
	                    this.shields[i].preciseCollides(this.avatarLaser);
	                }
	                for (n = 0; n < this.aliens.length; n++) {
	                    if (this.avatarLaser.collides(this.aliens[n])) {
	                        // disable and stop the laser from further movement.
	                        this.avatarLaser.setDirectionY(0);
	                        this.avatarLaser.setEnabled(false);

	                        // make the explosion to show where the alien was at the moment of collision.
	                        this.avatarLaser.setAnimationFrameIndex(2);
	                        this.avatarLaser.setDisappearCountdown(15);
	                        this.avatarLaser.setX(this.aliens[n].getCenterX() - this.avatarLaser.getExtentX());
	                        this.avatarLaser.setY(this.aliens[n].getCenterY() - this.avatarLaser.getExtentY());

	                        // hide and disable the collided alien.
	                        this.aliens[n].setEnabled(false);
	                        this.aliens[n].setVisible(false);
	                        // earn score to player based on the alien type.
	                        var score = 0;
	                        if (n < 11) {
	                            score = 30;
	                        } else if (n < 33) {
	                            score = 20;
	                        } else {
	                            score = 10;
	                        }

	                        // assign the earned score to currently active player.
	                        this.ctx.addScore(score);

	                        // speed up the movement of the aliens.
	                        var newStepSize = this.aliens[0].getStepSize() - Controller.ALIEN_STEP_DECREMENT_SIZE;

	                        for (var m = 0; m < this.aliens.length; m++) {
	                            this.aliens[m].setStepSize(newStepSize);
	                            this.aliens[m].setAnimationStepSize(newStepSize);
	                        }
	                        break;
	                    }
	                }
	            }
	        }

	        // check whether the flying saucer has reached the movement across the screen.
	        if (this.flyingSaucer.isVisible()) {
	            if (this.flyingSaucer.getDirectionX() == 1) {
	                if (this.rightOutOfBoundsDetector.collides(this.flyingSaucer)) {
	                    this.flyingSaucer.setEnabled(false);
	                    this.flyingSaucer.setVisible(false);
	                }
	            } else {
	                if (this.leftOutOfBoundsDetector.collides(this.flyingSaucer)) {
	                    this.flyingSaucer.setEnabled(false);
	                    this.flyingSaucer.setVisible(false);
	                }
	            }
	        }

	    }

	    render(ctx) {

	        this.footerLine.render(ctx);
	        this.avatar.render(ctx);

	        for (var i = 0; i < this.shields.length; i++) {
	            this.shields[i].render(ctx);
	        }

	        this.avatarLaser.render(ctx);
	        this.lifesText.render(ctx);
	        this.flyingSaucer.render(ctx);
	        this.gameOverText.render(ctx);
	        this.gameOverInstructions.render(ctx);

	        for (var i = 0; i < this.lifeSprites.length; i++) {
	            this.lifeSprites[i].render(ctx);
	        }

	        for (i = 0; i < this.aliens.length; i++) {
	            this.aliens[i].render(ctx);
	        }

	        for (var i = 0; i < this.alienShots.length; i++) {
	            this.alienShots[i].render(ctx);
	        }
	    }

	    /** *************************************************************************
	     * A function that is called when the state is being entered.
	     *
	     * This function is called before the state is being updated (i.e. ticked)
	     * for a first time. This makes it an ideal place to put all listener logic.
	     */
	    enter() {
	        this._keyup = this.keyUp.bind(this);
	        this._keydown = this.keyDown.bind(this);

	        document.addEventListener("keyup", this._keyup);
	        document.addEventListener("keydown", this._keydown);
	    }

	    /** *************************************************************************
	     * A function that is called when the state is being exited.
	     *
	     * This function is called after the state is being updated (i.e. ticked)
	     * for the last time. This makes it an ideal place to cleanup listeners etc.
	     */
	    exit() {
	        document.removeEventListener("keyup", this._keyup);
	        document.removeEventListener("keydown", this._keydown);
	    }

	    /** *************************************************************************
	     * A key listener function called when the user releases a key press.
	     * @param {KeyboardEvent} e The keyboard event received from the DOM.
	     */
	    keyUp(e) {
	        var key = e.keyCode ? e.keyCode : e.which
	        switch (key) {
	            case Constants.KEY_LEFT:
	                if (this.avatar.isEnabled() && this.avatar.getDirectionX() == -1) {
	                    this.avatar.setDirectionX(0);
	                }
	                break;
	            case Constants.KEY_RIGHT:
	               if (this.avatar.isEnabled() && this.avatar.getDirectionX() == 1) {
	                    this.avatar.setDirectionX(0);
	                }
	                break;
	            case Constants.KEY_SPACEBAR:
	               if (this.avatar.isEnabled() && this.avatarLaser.isVisible() == false) {
	                    // shoot the laser from the avatar position.
	                    this.avatarLaser.setVisible(true);
	                    this.avatarLaser.setEnabled(true);
	                    this.avatarLaser.setDirectionY(-1);
	                    this.avatarLaser.setX(this.avatar.getCenterX() - this.avatarLaser.getExtentX());
	                    this.avatarLaser.setY(this.avatar.getY());
	                    this.avatarLaser.setAnimationFrameIndex(0);

	                    // increment the laser counter.
	                    this.avatarLaserCount++;
	                }
	                break;
	            case Constants.KEY_ENTER:
	                {
	                    if (this.gameOverText.isVisible()) {
	                        // reset game context before returning to welcome scene.
	                        this.game.getPlayer1Context().reset();
	                        this.game.getPlayer2Context().reset();

	                        // return back to the welcome scene.
	                        var scene = this.game.getScene();
	                        var state = new WelcomeState(this.game);
	                        scene.setState(state);
	                    }
	                    break;
	                }
	        }
	    }

	    /** *************************************************************************
	     * A key listener function called when the user releases a key press.
	     * @param {KeyboardEvent} e The keyboard event received from the DOM.
	     */
	    keyDown(e) {
	        var key = e.keyCode ? e.keyCode : e.which;
	        switch (key) {
	            case Constants.KEY_LEFT:
	                if (this.avatar.isEnabled()) {
	                    this.avatar.setDirectionX(-1);
	                }
	                break;
	            case Constants.KEY_RIGHT:
	                if (this.avatar.isEnabled()) {
	                    this.avatar.setDirectionX(1);
	                }
	                break;
	        }
	    }

	}

	module.exports = Controller;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var AnimatedMovableSpriteEntity = __webpack_require__(14);

	class AvatarEntity extends AnimatedMovableSpriteEntity {
	    
	    /** ***************************************************************************
	     * An abstraction for the player avatar entity.
	     *
	     * This structure contains the additional definitions required for the player
	     * avatar object, which is the cannon tower that can be moved by the player.
	     */
	    constructor(game, scene) {
	        super(game);

	        console.log(`AvatarEntity constructor called with game: ${game} and scene: ${scene}`);  

	        this.scene = scene
	    }

	    explode() {
	        // stop and disable the movement of the avatar.
	        this.setDirectionX(0);
	        this.setEnabled(false);

	        // assign the explosion animation for the avatar.
	        this.clearAnimationFrames();
	        this.addAnimationFrame(128, 91, 45, 24);
	        this.addAnimationFrame(178, 91, 45, 24);
	        this.setAnimationFrameIndex(0);
	        this.setAnimationStepSize(6);
	        this.setDisappearCountdown(6 * 8);

	        // decrement lives and start the scene relaunch counter.
	        this.scene.decrementPlayerLives(this.game.getActivePlayer());
	        this.scene.startRelaunchCounter();
	    }

	    reset() {
	        // reset the starting position of the avatar.
	        this.setX(45);

	        // set avatar back to collideable and visible.
	        this.setEnabled(true);
	        this.setVisible(true);

	        // reset the visual presentation of the avatar.
	        this.clearAnimationFrames();
	        this.addAnimationFrame(86, 5, 40, 24);
	        this.setAnimationFrameIndex(0);
	    }

	}

	module.exports = AvatarEntity;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var MovableSpriteEntity = __webpack_require__(15);

	class AnimatedMovableSpriteEntity extends MovableSpriteEntity {

	    /** A constant default for the animation step size (0 = disable animation). */

	    static get DEFAULT_ANIMATION_STEP_SIZE() { return 0; }

	    /** ***************************************************************************
	     * An abstraction for all movable sprite entities that can be animated.
	     *
	     * This structure contains the logics required to make an movable entity to be
	     * animated. Animation can be used in two different modes:
	     *
	     * 1. Automatically animated mode.
	     * 2. Manually animated mode.
	     *
	     * Automatically animated mode where the entity is automatically animated when
	     * enough animation steps have been passed. Manually animated mode will only
	     * act as a placeholder for multiple sprites that must be manually assigned to
	     * make the sprite image to change.
	     *
	     * @param {SpaceInvaders.Game} game A reference to the target game instance.
	     */
	    constructor(game) {
	        super(game);

	        /** A definition for animation step (i.e. number of ticks) count. */
	        this.animationStepSize = AnimatedMovableSpriteEntity.DEFAULT_ANIMATION_STEP_SIZE;
	        /** A variable used to keep trakc of  the animation change rate. */
	        this.animationCounter = 0;

	        /** The index of the current animation frame. */
	        this.animationFrameIndex = 0;
	        /** The frames for the animation. */
	        this.animationFrames = [];

	    }

	    /** *************************************************************************
	     * Perform an animation step of the animated entity and change the frame when
	     * and if necessary.This function must be called from the parent scene object.
	     */
	    animate() {
	        if (this.animationStepSize > 0) {
	            this.animationCounter = Math.max(0, this.animationCounter - 1);
	            if (this.animationCounter <= 0) {
	                var nextFrame = ((this.animationFrameIndex + 1) % this.animationFrames.length);
	                this.setAnimationFrameIndex(nextFrame);
	                this.animationCounter = this.animationStepSize;
	            }
	        }
	    }

	    /** *************************************************************************
	     * Apply the given step size and clear the current step counter of the animation.
	     * @param {number} newStepSize A new step size for the animated entity.
	     */
	    setAnimationStepSize(newStepSize) {
	        this.animationStepSize = newStepSize;
	        this.animationCounter = this.animationStepSize;
	    }

	    /** *************************************************************************
	     * Specify the currently shown animation frame index.
	     * @param {number} newIndex The index of the animation frame to be shown.
	     */
	    setAnimationFrameIndex(newIndex) {
	        this.animationFrameIndex = Math.min(this.animationFrames.length, newIndex);

	        // calculate the dimensions for the next animation frame.
	        var newWidth = this.animationFrames[this.animationFrameIndex][2];
	        var newHeight = this.animationFrames[this.animationFrameIndex][3];
	        var newX = this.getCenterX() - (newWidth / 2);
	        var newY = this.getCenterY() - (newHeight / 2);

	        // assign the next animation frame as the current frame.
	        this.setClipX(this.animationFrames[this.animationFrameIndex][0]);
	        this.setClipY(this.animationFrames[this.animationFrameIndex][1]);
	        this.setWidth(newWidth);
	        this.setHeight(newHeight);
	        this.setX(newX);
	        this.setY(newY);
	    }

	    /** *************************************************************************
	     * Add an new animation frame for the animated entity.
	     * @param {number} clipX The sprite-to-image clip x-coordinate.
	     * @param {number} clipY The sprite-to-image clip y-coordinate.
	     * @param {number} width The width of the sprite.
	     * @param {number} height The height of the sprite.
	     */
	    addAnimationFrame(clipX, clipY, width, height) {
	        this.animationFrames.push([clipX, clipY, width, height]);
	    }

	    /** *************************************************************************
	     * Clear all available animation frames from the entity.
	     */
	    clearAnimationFrames() {
	        this.animationFrames = [];
	    }

	    getAnimationStepSize() { return this.animationStepSize; }
	    getAnimationFrameIndex() { return this.animationFrameIndex; }
	    getAnimationFrames() { return this.animationFrames; }

	}

	module.exports = AnimatedMovableSpriteEntity;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var SpriteEntity = __webpack_require__(9);

	class MovableSpriteEntity extends SpriteEntity {
	    static get DEFAULT_VELOCITY() { return 0.0; }
	    /** A constant default x-axis direction of the movement. */
	    static get DEFAULT_DIRECTION_X() { return 0.0; }
	    /** A constant default y-axis direction of the movement. */
	    static get DEFAULT_DIRECTION_Y() { return 0.0; }
	    /** A constant default step size for the movement. */
	    static get DEFAULT_STEP_SIZE() { return 0; }

	    /** ***************************************************************************
	     * An abstraction of all entities that are movable and have a sprite image.
	     *
	     * This class encapsulates the all necessary functionality for all entities for
	     * collideable, movable and drawable sprite entities. For example the player
	     * avatar and all enemies should be constructed from this structure.
	     *
	     * @param {SpaceInvaders.Game} game A reference to the target game instance.
	     */
	    constructor(game) {
	        super(game);

	        /** A constant default for the velocity of the movement. */

	        /** The velocity of the entity. */
	        this.velocity = MovableSpriteEntity.DEFAULT_VELOCITY;
	        /** The x-axis direction. */
	        this.directionX = MovableSpriteEntity.DEFAULT_DIRECTION_X;
	        /** The y-axis direction. */
	        this.directionY = MovableSpriteEntity.DEFAULT_DIRECTION_Y;

	        /** The size of the movement step (i.e. updates before movement is applied). */
	        this.stepSize = 0;
	        /** The step counter to track when to perform a movement step. */
	        this.stepCounter = 0;

	        /** The step counter to track when to perform an automatic disappear. */
	        this.disappearCountdown = 0;

	    }

	    /** *************************************************************************
	     * Update (i.e. tick) the the logic within the entity.
	     * @param {number} dt The delta time from the previous tick operation.
	     */
	    update(dt) {
	        if (this.disappearCountdown > 0) {
	            this.disappearCountdown--;
	            if (this.disappearCountdown <= 0) {
	                this.setEnabled(false);
	                this.setVisible(false);
	            }
	        }
	        
	        this.stepCounter = Math.max(0, this.stepCounter - 1);
	        if (this.stepCounter <= 0) {
	            this.setX(this.getX() + this.directionX * this.velocity * dt);
	            this.setY(this.getY() + this.directionY * this.velocity * dt);
	            this.stepCounter = this.stepSize;
	        }

	    }

	    /** *************************************************************************
	     * Apply the given step size and clear the current step counter of the entity.
	     * @param {number} newStepSize A new step size for the movable entity.
	     */
	    setStepSize(newStepSize) {
	        this.stepSize = newStepSize;
	        this.stepCounter = this.stepSize;
	    }

	    /** *************************************************************************
	     * Apply the given amount of ticks to perform before automatically disappear.
	     * @param {number} countdown The amount of ticks before disappearing.
	     */
	    setDisappearCountdown(countdown) {
	        this.disappearCountdown = Math.max(0, countdown);
	    }

	    getVelocity() { return this.velocity; }
	    getDirectionX() { return this.directionX; }
	    getDirectionY() { return this.directionY; }
	    getStepSize() { return this.stepSize; }
	    getStepCounter() { return this.stepCounter; }
	    setVelocity(newVelocity) { this.velocity = newVelocity; }
	    setDirectionX(newDirection) { this.directionX = newDirection; }
	    setDirectionY(newDirection) { this.directionY = newDirection; }

	}

	module.exports = MovableSpriteEntity;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var AnimatedMovableSpriteEntity = __webpack_require__(14);

	class AvatarLaser extends AnimatedMovableSpriteEntity {

	    constructor(game) {
	        super(game);
	    }

	    /** *************************************************************************
	     * Explode (i.e. destroy) the avatar laser shot explosion animation.
	     *
	     * This animation replaces the currently shown sprite or sprite animation
	     * with an sprite that indicates that the player shot is exploding. It
	     * will also trigger a timer after which the player shot will be disabled.
	     */

	    explode() {
	        this.setAnimationStepSize(0);
	        this.setAnimationFrameIndex(3);
	        this.setEnabled(false);
	        this.setDisappearCountdown(10);
	        this.setDirectionY(0);
	    }

	}

	module.exports = AvatarLaser;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var AnimatedMovableSpriteEntity = __webpack_require__(14);

	class AlienShotEntity extends AnimatedMovableSpriteEntity {

	    /** ***************************************************************************
	     * An abstraction for all alien shots.
	     *
	     * This structure contains the additional definitions and methods for the alien
	     * shots. There are three different alien shots available; rolling, plumbing
	     * and the squiggly shot. Each shot has a bit different behavior, which are
	     * described in the following table.
	     *
	     * Rolling shot
	     * A "homing" shot that is always launched from the players nearest alien.
	     *
	     * Plunger shot
	     * A shot that follows a predefined alien columns list and is not used when there
	     * is only one alien left.
	     *
	     * Squiggly shot
	     * A shot that follows a predefined alien columns list and is not used when the
	     * flying saucer is being shown.
	     *
	     * Table is based on foundings from the following URL:
	     * http://www.computerarcheology.com/Arcade/SpaceInvaders/Code.html
	     *
	     * @param {SpaceInvaders.Game} game A reference to the target game instance.
	     */
	    constructor(game, scene) {
	        super(game)

	        this.scene = scene;

	        /** A counter to keep track of the amount of update calls. */
	        this.progressTicks = 0;

	    }
	    animateAndUpdate(dt) {
	        if (this.isVisible()) {
	            this.animate();
	            this.update(dt);
	            this.progressTicks++;
	        }
	    }

	    fire() {
	        var animationFrames = this.getAnimationFrames();
	        if (animationFrames.length > 3) {
	            animationFrames.pop();
	        }
	        this.setAnimationFrameIndex(0);
	        this.setAnimationStepSize(4);
	        this.setVisible(true);
	        this.setEnabled(true);
	        this.setDirectionY(1);
	        this.progressTicks = 1;
	    }

	    explode() {
	        this.addAnimationFrame(218, 5, 18, 24);
	        this.setAnimationStepSize(0);
	        this.setAnimationFrameIndex(3);
	        this.setEnabled(false);
	        this.setDisappearCountdown(10);
	        this.setDirectionY(0);
	    }

	    isReadyToBeFired() {
	        // do not allow shot to be re-fired when still in progress.
	        if (this.isVisible()) {
	            return false;
	        }

	        // get a reference to the array of alien shots and the reload rate.
	        var shots = this.scene.getAlienShots();
	        var reloadRate = this.scene.getAlienReloadRate();

	        // iterate over shots to check whether aliens have reloaded their weapons.
	        for (var i = 0; i < shots.length; i++) {
	            var shotTicks = shots[i].getProgressTicks();
	            if (shots[i] != this) {
	                if (shotTicks > 0) {
	                    if (reloadRate >= shotTicks) {
	                        return false;
	                    }
	                }
	            }
	        }

	        // aliens have been reloaded and it's ok to fire now.
	        return true;
	    }

	    getProgressTicks() { return this.progressTicks; }

	}

	module.exports = AlienShotEntity;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var SpriteEntity = __webpack_require__(9);
	var AvatarLaser = __webpack_require__(16);

	class Shield extends SpriteEntity {

	    /** ***************************************************************************
	     * An abstraction for all player shields.
	     *
	     * This structure contains the logics required for the player avatar shields.
	     * In the original Space Invaders, there are four shields that player mayer use
	     * to protect the avatar against the alien laser shots.
	     *
	     * Shields are destructable, where destructions consume a part of the shield. In
	     * fact, there are three different things that must consume shields.
	     *
	     * 1. Alien shots
	     * 2. Player shots
	     * 3. Alien contact
	     *
	     * Each collision with the previously mentioned entity must consume a part of
	     * the shield where the collision occurs. Collided shots must be first exploded
	     * and then use the explosion sprite to consume part of the shield pixels away.
	     * Note that avatar and alien lasers collides with a different explosion sprite.
	     *
	     * @param {Game} game A reference to the target game instance.
	     */
	    constructor(game) {
	        super(game);
	        /** Sprite pixels from left-to-right and top-to-bottom order. */
	        this.pixels = undefined;
	        /** A definition whether the shields pixels have been modified. */
	        this.pixelsDirty = false;
	    }

	    /** *************************************************************************
	     * Check whether the shield precisely collides with the target object.
	     *
	     * This function is used to perform two-phase collision detection. Here we
	     * use a broad (AABB-ABB) and narrow (pixel-pixel) phases to detect whether
	     * the provided object hits the shield.
	     *
	     * @param {SpaceInvaders.CollideableEntity} other Entity to check against.
	     */
	    preciseCollides(other) {
	        
	        if (this.collides(other)) {
	            // get a reference to current position and size.
	            var x = this.getX();
	            var y = this.getY();
	            var width = this.getWidth();

	            // iterate pixels based on the object movement direction.
	            if (this.pixels == undefined) {
	                this.refreshPixels();
	            }
	            var data = this.pixels.data;

	            if (other instanceof AvatarLaser) {
	                for (var i = (data.length - 1); i >= 0; i -= 4) {
	                    if (data[i + 3] != 0 && this.preciseCollide(data, (i / 4), other)) {
	                        break;
	                    }
	                }
	            } else {
	                for (var i = 0; i < data.length; i += 4) {
	                    if (data[i + 3] != 0 && this.preciseCollide(data, (i / 4), other)) {
	                        break;
	                    }
	                }
	            }
	        }
	    }

	    /** *************************************************************************
	     * Check whether the target pixel collides with the specified object.
	     *
	     * This function checks whether the provided pixel does a pixel-wide hit with
	     * the provided object instance bounding box (AABB). If there is an collision
	     * then the target object will be exploded and the explosion pixels will be
	     * consumed i.e. removed from the shield sprite object to indicate destruct.
	     *
	     * @param pixels A map of pixels.
	     * @param pixelIdx The index of the target index.
	     * @param object Object to check collision against.
	     */
	    preciseCollide(pixels, pixelIdx, object) {
	        var pixelX = (this.getX() + (pixelIdx % this.getWidth()));
	        var pixelY = (this.getY() + Math.floor(pixelIdx / this.getWidth()));
	        
	        if (object.containsPixel(pixelX, pixelY)) {
	            object.explode();
	            object.setY(pixelY - object.getExtentY());
	            object.render(this.game.getCanvasCtx());
	            this.refreshPixels();
	            this.eraseWhitePixels();
	            this.pixelsDirty = true;
	            return true;
	        }
	        return false;
	    }

	    /** *************************************************************************
	     * Erase all white pixels from the wrapped sprite pixels.
	     *
	     * This function removes all white pixels from the currently wrapped sprite
	     * image pixels. It is used to remove explosion specific pixels from the map
	     * of pixels that function and indicate the condition of a player shield.
	     */
	    eraseWhitePixels() {
	        var data = this.pixels.data;
	        for (var j = 0; j < data.length; j++) {
	            if (data[j] == 255 && data[j + 1] == 255 && data[j + 2] == 255) {
	                data[j] = 0;
	                data[j + 1] = 0;
	                data[j + 2] = 0;
	                data[j + 3] = 0;
	            }
	        }
	    }

	    /** *************************************************************************
	     * Refresh the pixels belonging to the shield object.
	     *
	     * This function refreshes the wrapped sprite image pixel map that visually
	     * indicate the condition as well as is being used in the collision detection.
	     */
	    refreshPixels() {
	        this.pixels = this.game.getCanvasCtx().getImageData(
	            this.getX(),
	            this.getY(),
	            this.getWidth(),
	            this.getHeight());
	    }

	    render(ctx) {
	        
	        if (this.isVisible()) {
	            if (this.pixelsDirty) {
	                ctx.putImageData(this.pixels, this.getX(), this.getY());
	            } else {
	                if (this.getImage()) {
	                    ctx.drawImage(this.getImage(),
	                        this.getClipX(),
	                        this.getClipY(),
	                        this.getWidth(),
	                        this.getHeight(),
	                        this.getX(),
	                        this.getY(),
	                        this.getWidth(),
	                        this.getHeight());
	                }
	            }
	        }

	    }

	}   

	module.exports = Shield;

/***/ })
/******/ ]);