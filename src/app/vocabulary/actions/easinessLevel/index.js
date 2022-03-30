"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keepTrackOfEasiness = exports.DEFAULT_JUMP_DOWN = exports.MAX_JUMP_UP = exports.MIN_JUMP_UP = void 0;
exports.MIN_JUMP_UP = 50;
exports.MAX_JUMP_UP = 500;
exports.DEFAULT_JUMP_DOWN = 100;
let easyInARow = 0;
/**
 * If the user clicks on "Easy" several times in a row,
 * then we increase the "easinessLevel". EasinessLevel is a
 * number that stores the lowest cardInSession.getSortKey() we're interested in.
 */
function keepTrackOfEasiness({ rating, isANewCard, card }) {
    // /* Currently only turned on for the overall
    //    game and not article-specific games */
    // if (deck.session.allowed_ids) return;
    //
    // /* Tracks only new cards in a row */
    // if (isANewCard) {
    //   if (rating === EASY) {
    //     easyInARow++;
    //     if (easyInARow >= 2) {
    //       increaseEasinessLevel(card.getSortKey());
    //     }
    //   } else {
    //     easyInARow = 0;
    //   }
    // }
    //
    // if (rating === BAD) {
    //   easinessLevelShouldBeLowerThan(card.getSortKey());
    // }
}
exports.keepTrackOfEasiness = keepTrackOfEasiness;
