var AnimatedMovableSpriteEntity = require('./AnimatedMovableSpriteEntity.js');

class AvatarEntity extends AnimatedMovableSpriteEntity {
    
    /** ***************************************************************************
     * An abstraction for the player avatar entity.
     *
     * This structure contains the additional definitions required for the player
     * avatar object, which is the cannon tower that can be moved by the player.
     */
    constructor(game, scene) {
        super(game);
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