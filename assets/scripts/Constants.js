class Constants {

  /** A constant definition for the canvas element ID. */
  static get CANVAS_ID() { return "game-canvas"; }

  /** A constant definition for the game framerate. */
  static get FPS() { return (1000.0 / 60.0); }

  /** A constant for the number one keycode. */
  static get KEY_1() { return (49); }

  /** A constant for the number two keycode. */
  static get KEY_2() { return (50); }

  /** A constant for the right-arrow keycode. */
  static get KEY_RIGHT() { return (39); }

  /** A constant for the left-arrow keycode. */
  static get KEY_LEFT() { return (37); }

  /** A constant for the spacebar keycode. */
  static get KEY_SPACEBAR() { return (32); }

  /** A constant for the enter keycode. */
  static get KEY_ENTER() { return (13); }

  constructor() {}

}

module.exports = Constants;