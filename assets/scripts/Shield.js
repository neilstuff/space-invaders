var SpriteEntity = require('./SpriteEntity.js');
var AvatarLaser = require('./AvatarLaser.js');

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