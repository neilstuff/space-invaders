var AnimatedMovableSpriteEntity = require('./AnimatedMovableSpriteEntity.js');

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
