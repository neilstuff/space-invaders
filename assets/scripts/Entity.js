var Constants = require('./Constants.js');

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