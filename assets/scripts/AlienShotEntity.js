var AnimatedMovableSpriteEntity = require('./AnimatedMovableSpriteEntity.js');

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