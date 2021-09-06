import { BAD, EASY } from "app/vocabulary/actions/card";
import { deck } from "app/vocabulary/actions/deck";
import { getEasinessLevel } from "app/vocabulary/actions/sync";
import {
  getLowestBadSortKey,
  getMaxSortKey,
  recreateAfterChangingEasinessLevel,
  setEasinessLevel,
} from "app/vocabulary/actions/easinessLevel/functions";

let easyInARow = 0;
const MIN_JUMP = 50;
const MAX_JUMP = 200;
const DEFAULT_JUMP_DOWN = 100;
let last_jump_up;

/**
 * If the user clicks on "Easy" several times in a row,
 * then we increase the "easinessLevel". EasinessLevel is a
 * number that stores the lowest card.sortKey we're interested in.
 */
export function keepTrackOfEasiness(rating, isNew) {
  if (this.session.allowed_card_ids) return;
  if (isNew) {
    if (rating === EASY) {
      easyInARow++;
      if (easyInARow >= 2) {
        let change = Math.min(last_jump_up * 2 || MIN_JUMP, MAX_JUMP);
        last_jump_up = change;
        const newValue = Math.min(
          Math.max(0, (getEasinessLevel() || 0) + change),
          getLowestBadSortKey() || getMaxSortKey() || deck.cards_sorted.length
        );
        if (newValue !== getEasinessLevel()) {
          setEasinessLevel(newValue);
          recreateAfterChangingEasinessLevel();
        }
      }
    } else {
      easyInARow = 0;
    }
    if (rating === BAD && getEasinessLevel()) {
      let min = deck.session.currentCard.sortKey - DEFAULT_JUMP_DOWN;
      if (min < getEasinessLevel()) {
        setEasinessLevel(Math.max(0, min));
      }
    }
    // RatingHistoryForNewCards.unshift(rating);
  }
}
