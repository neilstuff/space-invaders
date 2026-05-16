var Entity = require('./Entity.js');

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