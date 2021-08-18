import { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";

let user_level = 0;
let easyInARow = 0;

/**
 * Ef notandi ýtir þrisvar sinnum á easy þá þarf levelið hans að stökkva fram.
 * @memberof Deck
 */
export function keepTrackOfUserStatus(rating, isNew) {
  const deck = this;
  if (isNew) {
    if (rating === EASY) {
      easyInARow++;
      deck.easinessLevel = 200;
      deck.session.cards = [];
      // deck.session.cards.filter(
      //   (j) => j.history.length > 0 || j.cannotBeShownBefore
      // )  ;
      deck.session.createCards();
      // if (easyInARow === 2) {
      //   user_level++;
      // }
    } else {
      easyInARow = 0;
    }
  }
}
