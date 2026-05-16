var Entity = require('./Entity.js');

class TextEntity extends Entity {

    /** A constant default value for the text to be drawn. */
    static get DEFAULT_TEXT() { return ""; }

    /** A constant default fill style (i.e. color) for the text. */
    static get DEFAULT_FILL_STYLE() { return "white"; }

    /** A constant default font definition for the text. */
    static get DEFAULT_FONT() { return "24pt monospace"; }

    /** A constant default text alignment for the rendering. */
    static get DEFAULT_ALIGN() { return "start"; }

    /** A constant default visibility state for the text. */
    static get DEFAULT_VISIBLE() { return true; }

    /** A constant amount of toggles to perform after #blink is called. */
    static get DEFAULT_BLINK_COUNT() { return 30; }

    /** A constant amount of updates (i.e. interval) between the blinking. */
    static get DEFAULT_BLINK_FREQUENCY() { return 5; }

    /** ***************************************************************************
     * A textual entity for all texts used in the Space Invaders game.
     *
     * This class presents a textual entity within the game scene. It does really
     * an encapsulation of the 2d drawing context textual presentation functions.
     *
     * @param {SpaceInvaders.Game} game A reference to the target game instance.
     */
    constructor(game) {
        super(game)

        /** The text to be rendered. */
        this.text = TextEntity.DEFAULT_TEXT;
        /** The fill style (i.e. color) used to draw the text. */
        this.fillStyle = TextEntity.DEFAULT_FILL_STYLE;
        /** The target font description i.e. size, font family, etc. */
        this.font = TextEntity.DEFAULT_FONT;
        /** The text align definition (start|end|center|left|right). */
        this.align = TextEntity.DEFAULT_ALIGN;
        /** The definition whether the entity should be rendered. */
        this.visible = TextEntity.DEFAULT_VISIBLE;
        /** The amount of remaining blinks (visible/invisible toggles). */
        this.blinks = 0;
        /** The blink timer that will perform the blink frequency calculation. */
        this.blinkTimer = 0;
        /** Amount of blinks to be perfomed after #blink is called (-1: infinite).*/
        this.blinkCount = TextEntity.DEFAULT_BLINK_COUNT;
        /** The amount of updates (i.e. interval) between the blinks. */
        this.blinkFrequency = TextEntity.   DEFAULT_BLINK_FREQUENCY;

    }

    /** *************************************************************************
     * Update (i.e. tick) the the logic within the entity.
     * @param {double} dt The delta time from the previous tick operation.
     */
    update(dt) {
        if (this.blinks > 0 || this.blinks == -1) {
            this.blinkTimer--;
            if (this.blinkTimer == 0) {
                this.setVisible(!this.isVisible());
                this.blinks--;
                this.blinks = Math.max(this.blinks, -1);
                if (this.blinks > 0 || this.blinks == -1) {
                    this.blinkTimer = this.blinkFrequency;
                }
            }
        }
    }

    /** *************************************************************************
     * Render (i.e. draw) the text on the screen.
     * @param {CanvasRenderingContext2D} ctx The drawing context to use.
     */
    render(ctx) {
        if (this.isVisible()) {
            ctx.fillStyle = this.getFillStyle();
            ctx.textAlign = this.getAlign();
            ctx.font = this.getFont();
            ctx.fillText(this.getText(), this.getX(), this.getY());
        }

    }

    /** *************************************************************************
     * Start blinking (i.e. toggling visible/invisible).
     *
     * After this function is called, the target entity will start to blink if it
     * is currently visible. If the entity is already blinking then the amount of
     * remaining blinks will be reset back to the amount of the this.BLINK_COUNT.
     */
    blink() {
        if (this.isVisible() || this.blinks > 0) {
            this.setVisible(true);
            this.blinks = this.getBlinkCount();
            this.blinkTimer = this.getBlinkFrequency();
        }
    }

    getText() { return this.text; }
    getFillStyle() { return this.fillStyle; }
    getFont() { return this.font; }
    getAlign() { return this.align; }
    isVisible() { return this.visible; }
    getBlinkCount() { return this.blinkCount; }
    getBlinkFrequency() { return this.blinkFrequency; }

    setText(newText) { this.text = newText; }
    setFillStyle(newStyle) { this.fillStyle = newStyle; }
    setFont(newFont) { this.font = newFont; }
    setAlign(newAlign) { this.align = newAlign; }
    setVisible(newVisible) { this.visible = newVisible; }
    setBlinkCount(newCount) { this.blinkCount = newCount; }
    setBlinkFrequency(newFreq) { this.blinkFrequency = newFreq; }
}

module.exports = TextEntity;