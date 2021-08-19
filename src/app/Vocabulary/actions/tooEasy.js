import { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";
import { deck } from "app/Vocabulary/actions/deck";

let easyInARow = 0;
const MIN_JUMP = 30;
const MAX_JUMP = 200;
let last_jump_up;
let last_jump_down;
let RatingHistoryForNewCards = [];

/**
 * Ef notandi ýtir þrisvar sinnum á easy þá þarf levelið hans að stökkva fram.
 * @memberof Deck
 */
export function keepTrackOfUserStatus(rating, isNew) {
  if (process.env.NODE_ENV !== "development") return;
  if (this.session.allowed_card_ids) return;
  if (!deck.isEasinessLevelOn()) return;
  if (isNew) {
    if (rating === EASY) {
      easyInARow++;
      if (easyInARow > 2) {
        setEasinessLevel(last_jump_up * 2);
        deck.session.cards = [];
        // TODO
        // deck.session.cards.filter(
        //   (j) => j.history.length > 0 || j.cannotBeShownBefore
        // )  ;
        deck.session.createCards();
        console.log(`Easiness level increased to ${deck.easinessLevel}`);
      }
    } else {
      easyInARow = 0;
      console.log(`Easiness level lowered to ${deck.easinessLevel}`);
    }
    if (rating === BAD && deck.easinessLevel) {
      setEasinessLevel(last_jump_down * 2);
    }
    RatingHistoryForNewCards.unshift(rating);
  }
}

const setEasinessLevel = (incr) => {
  let change = Math.min(Math.abs(incr || 0) || MIN_JUMP, MAX_JUMP);
  if (incr > 0) {
    last_jump_up = change;
    last_jump_down = null;
  } else {
    change = -change;
    last_jump_down = change;
    last_jump_up = null;
  }
  deck.easinessLevel = (deck.easinessLevel || 0) + change;
};

/**
 * @memberof Deck
 */
export function isEasinessLevelOn() {
  return !this.session.allowed_card_ids && this.easinessLevel;
}
