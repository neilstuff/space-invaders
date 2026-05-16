var MovableSpriteEntity = require('./MovableSpriteEntity.js');

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