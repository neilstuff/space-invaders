var Constants = require('./Constants.js');
var SpriteEntity = require('./SpriteEntity.js');
var AvatarEntity = require('./AvatarEntity.js');
var AvatarLaser = require('./AvatarLaser.js');
var TextEntity = require('./TextEntity.js');
var CollideableEntity = require('./CollideableEntity.js');
var AnimatedMovableSpriteEntity = require('./AnimatedMovableSpriteEntity.js');
var AlienShotEntity = require('./AlienShotEntity.js');
var Shield = require('./Shield.js');
var Sound = require('./Sound.js');
var Game = require('./Game.js');

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

    /** A time that is waited after player avatar gets destroyed. */
    static get ALIEN_FRAME_DECREMENT() { return 4; }

   /** A constant sound rate decrement for the aliens. */
    static get ALIEN_SOUND_RATE_DECREMENT() { return 0.1; }

   /** The inital sound rate */
    static get ALIEN_SOUND_INITIAL_STATE() { return 72; }

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

        /** The current shot column index of the squiggly shot. */
        this.alienSquigglyShotColumnIndice = Controller.ALIEN_SQUIGGLY_SHOT_START_INDEX;
        /** The column indices used to define where to shoot the alien missiles. */
        this.alienShotColumn = [
            0, 6, 0, 0, 0, 3, 10, 0, 5, 2, 0, 0, 10, 8, 1, 7, 1, 10, 3, 6, 9
        ];

        this.alienSounds = [
            "fastinvader1", "fastinvader2", "fastinvader3", "fastinvader4"
        ];

        this.soundIndex = 0;
        this.soundRateCounter = 72;
        this.soundRateDecrement = 1;

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

        // Initialize the sound manager for the game.
        this.sound = new Sound();

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
                        sound.play("explosion");
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

            if (this.avatar.isEnabled() && this.alienShots[1].isReadyToBeFired()) {
                // get the next target column and increment the column index pointer.
                var column = this.alienShotColumn[this.alienPlungerShotColumnIndice];

                this.alienPlungerShotColumnIndice = (this.alienPlungerShotColumnIndice + 1);
                this.alienPlungerShotColumnIndice = (this.alienPlungerShotColumnIndice % Controller.ALIEN_SHOT_INDICE_COUNT);

                for (var n = 4; n >= 0; n--) {
                    var idx = (n * 11) + column;

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
                this.sound.play("ufo_lowpitch")
            } else {
                // get the next target column and increment the column index pointer.
                var column = this.alienShotColumn[this.alienSquigglyShotColumnIndice];
                this.alienSquigglyShotColumnIndice = (this.alienSquigglyShotColumnIndice + 1);
                this.alienSquigglyShotColumnIndice = (this.alienSquigglyShotColumnIndice % Controller.ALIEN_SHOT_INDICE_COUNT);

                for (var n = 4; n >= 0; n--) {
                    var idx = (n * 11) + column;
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
                this.sound.play("explosion");
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

                var decrementSound = false;
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
                        if (decrementSound == false) {
                            this.soundRateDecrement += Controller.ALIEN_SOUND_RATE_DECREMENT;
                            decrementSound = true;
                            console.log(`Alien Sound Rate Decrement: ${this.soundRateDecrement}`);
                        }

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

        if (this.soundRateCounter <= 0) {
            this.sound.play(this.alienSounds[this.soundIndex]);
            this.soundIndex = (this.soundIndex + 1) % this.alienSounds.length;
            this.soundRateCounter = Controller.ALIEN_SOUND_INITIAL_STATE;
        } else {
            this.soundRateCounter -= this.soundRateDecrement;        
        }
        
        console.log(`Sound Rate Counter: ${this.soundRateCounter} : Sound Rate Decrement: ${this.soundRateDecrement}`);

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
                    this.sound.play("shoot");
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