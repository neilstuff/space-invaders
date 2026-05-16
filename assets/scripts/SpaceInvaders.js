/** A namespace for the Space Invaders game. */
class SpaceInvaders {

    /** *************************************************************************
     * A helper utility to create a four digit string from the given score.
     *
     * Four digit string is ensured by prepending additional zeroes to the given
     * value when necessary. For example value 12 is transformed to "0012" string.
     *
     * @param {number} score The score to be converted into a string.
     */

    static toScoreString(score) {
        var result = "NaN";
        if (typeof score == 'number') {
            result = score.toString();
            var difference = (4 - result.length);
            if (difference >= 0) {
                result = "0000" + result;
            }
            result = result.substring(result.length - 4);
        }
        return result;

    }

    constructor() {
    }

}

module.exports = SpaceInvaders;