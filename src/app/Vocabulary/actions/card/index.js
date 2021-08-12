import { average, clamp } from "app/App/functions/math";
import {
  printWord,
  getCardsWithSameTerm,
} from "app/Vocabulary/actions/functions";
import _ from "underscore";
import getRanking from "app/Vocabulary/actions/card/getRanking";
import rate from "app/Vocabulary/actions/card/rate";
import postponeRelatedCards from "app/Vocabulary/actions/card/postponeRelatedCards";
import { deck } from "app/Vocabulary/actions/deck";

export const BAD = 1;
export const GOOD = 2;
export const EASY = 3;

class Card {
  constructor(data, index, session) {
    this.session = session;
    this.history = [];
    this.absoluteQueuePosition = index;
    Object.assign(this, data);
  }
  // lastRating(){
  //   return this.history[0]
  // }
  // secondLastRating(){
  //   return this.history[0]
  // }
  isNew() {
    // !(card.id in deck.schedule) && card.history.length === 0;
    return !this.getScore() && this.history.length === 0;
  }
  isNewTerm() {
    // There exists at least one term
    return this.terms.some((term_id) =>
      // Where every card is new
      deck.terms[term_id].cards.every(
        (card_id) =>
          !(card_id in deck.schedule) &&
          !this.session.cards.some(
            (c) => c.id === card_id && c.history.length > 0
          )
      )
    );
  }
  getScore() {
    return deck.schedule[this.id]?.score;
  }
}

Card.prototype.rate = rate;
Card.prototype.getRanking = getRanking;
Card.prototype.postponeRelatedCards = postponeRelatedCards;

Card.prototype.showIn = function ({
  interval,
  minInterval,
  cannotBeShownBefore,
}) {
  if (interval) {
    this.absoluteQueuePosition = this.session.counter + interval;
  } else if (minInterval) {
    const newPos = this.session.counter + interval;
    if (newPos > this.absoluteQueuePosition) {
      this.absoluteQueuePosition = newPos;
    }
  }

  const c = cannotBeShownBefore || ((interval || minInterval) > 6 ? 6 : 3);
  this.cannotBeShownBefore = Math.max(
    this.cannotBeShownBefore || 0,
    this.session.counter + c
  );

  console.log(
    `${printWord(this.id)} – cannotBeShownBefore ${
      this.cannotBeShownBefore
    }, qp ${this.absoluteQueuePosition} `
  );
};
Card.prototype.canBeShown = function () {
  return (
    !this.cannotBeShownBefore ||
    this.cannotBeShownBefore <= this.session.counter
  );
};

// Card.prototype.shouldShowHint = function () {
//   const lastTwoAverage = average(this.history.slice(0, 2));
//   return !(
//     this.history[0] === EASY ||
//     (this.history.length >= 2 && lastTwoAverage >= GOOD)
//   );
// };

export default Card;
