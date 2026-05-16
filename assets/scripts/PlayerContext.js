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