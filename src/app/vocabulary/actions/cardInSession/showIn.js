"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canBeShown = exports.showIn = void 0;
/**
 * @memberOf CardInSession#
 * All values are relative to the currently shown card, which is at 0.
 */
function showIn({ interval, minInterval, cannotBeShownBefore, }) {
    /* Set queue position (soft requirements) */
    if (interval) {
        this.setQueuePosition(interval);
    }
    if (minInterval) {
        this.setQueuePosition(Math.max(this.getQueuePosition(), minInterval));
    }
    /* Can absolutely not be shown before X (strong requirements) */
    if (!cannotBeShownBefore) {
        if ((interval || minInterval) > 6) {
            cannotBeShownBefore = 6;
        }
        else {
            cannotBeShownBefore = 3;
        }
    }
    if (interval) {
        cannotBeShownBefore = Math.min(cannotBeShownBefore, interval);
    }
    this.setCannotBeShownBefore(cannotBeShownBefore);
    // log(
    //   `${printWord(this.id)} – cannotBeShownBefore ${
    //     this.cannotBeShownBefore
    //   }, queue position: ${
    //     this.absoluteQueuePosition - this.session.counter
    //   }. Input: ${JSON.stringify({ interval, minInterval, cannotBeShownBefore })}`
    // );
}
exports.showIn = showIn;
/**
 * @memberOf CardInSession#
 * @returns {boolean}
 */
function canBeShown() {
    return (!this.cannotBeShownBefore ||
        this.cannotBeShownBefore <= this.session.counter);
}
exports.canBeShown = canBeShown;
