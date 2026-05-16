var CollideableEntity = require('./CollideableEntity.js');

class SpriteEntity extends CollideableEntity {
    /** A constant default for the sprite width. */
    static get DEFAULT_WIDTH() { return 0; }
    /** A constant default for the sprite height. */
    static get DEFAULT_HEIGHT() { return 0; }
    /** A constant default for the sprite clipping x-coordinate. */
    static get DEFAULT_CLIP_X() { return 0; }
    /** A constant default for the sprite clipping y-coordinate. */
    static get DEFAULT_CLIP_Y() { return 0; }
    /** A constant default for the sprite image. */
    static get DEFAULT_IMAGE() { return undefined; }
    /** A constant default for the sprite visibility. */
    static get DEFAULT_VISIBLE() { return true; }

    /** ***************************************************************************
     * A sprite entity for image sprites for the Space Invaders game.
     *
     * This entity presents a drawable sprite entity that is drawn from an external
     * image file provided with the #setImage function. Note that it is typically
     * a good idea to put all sprites in a single sprite sheet so the same image is
     * being loaded only once and can be therefore used with all sprites.
     *
     * @param {Game} game A reference to the root game instance.
     */
    constructor(game) {
        super(game);

        /** The width of the sprite. */
        this.width = SpriteEntity.DEFAULT_WIDTH;
        /** The height of the sprite. */
        this.height = SpriteEntity.DEFAULT_HEIGHT;
        /** The clipping x-coordinate of the image. */
        this.clipX = SpriteEntity.DEFAULT_CLIP_X;
        /** The clipping y-coordinate of the image. */
        this.clipY = SpriteEntity.DEFAULT_CLIP_Y;
        /** The source image to render sprite from. */
        this.image = SpriteEntity.DEFAULT_IMAGE;
        /** The definition whether the sprite is visible. */
        this.visible = SpriteEntity.DEFAULT_VISIBLE;

        /** Ensure initial parent collideable boundary x-axis. */
        this.setExtentX(this.width / 2);
        /** Ensure initial parent collideable boundary y-axis. */
        this.setExtentY(this.height / 2);
        
    }

    render(ctx) {
        if (this.image && this.isVisible()) {
            ctx.drawImage(this.image,
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

    setWidth(newWidth) {
        this.width = newWidth;
        this.setExtentX(this.width / 2);
    }

    setHeight(newHeight) {
        this.height = newHeight;
        this.setExtentY(this.height / 2);
    }

    getWidth() { return this.width; }
    getHeight() { return this.height; }
    getClipX() { return this.clipX; }
    getClipY() { return this.clipY; }
    getImage() { return this.image; }
    isVisible() { return this.visible; }
    setClipX(newClip) { this.clipX = newClip; }
    setClipY(newClip) { this.clipY = newClip; }
    setImage(newImage) { this.image = newImage; }
    setVisible(newVisible) { this.visible = newVisible; }

}

module.exports = SpriteEntity;