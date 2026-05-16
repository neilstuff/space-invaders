var SpriteEntity = require('./SpriteEntity.js');

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