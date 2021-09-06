import { BAD, EASY } from "app/vocabulary/actions/card";
import {
  decreaseEasinessLevel,
  getEasinessLevel,
  increaseEasinessLevel,
} from "app/vocabulary/actions/easinessLevel/functions";
import { deck } from "app/vocabulary/actions/deck";

let easyInARow = 0;
export const MIN_JUMP_UP = 50;
export const MAX_JUMP_UP = 200;
export const DEFAULT_JUMP_DOWN = 100;

/**
 * If the user clicks on "Easy" several times in a row,
 * then we increase the "easinessLevel". EasinessLevel is a
 * number that stores the lowest card.sortKey we're interested in.
 */
export function keepTrackOfEasiness(rating, isNew) {
  /* Currently only turned on for the overall
     game and not article-specific games */
  if (deck.session.allowed_card_ids) return;

  /* Tracks only new cards in a row */
  if (isNew) {
    if (rating === EASY) {
      easyInARow++;
      if (easyInARow >= 2) {
        increaseEasinessLevel();
      }
    } else {
      easyInARow = 0;
    }
  }

  if (rating === BAD) {
    decreaseEasinessLevel();
  }
}
