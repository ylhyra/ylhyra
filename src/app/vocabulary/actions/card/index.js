import getRanking from "app/vocabulary/actions/card/getRanking";
import rate from "app/vocabulary/actions/card/rate";
import postponeRelatedCards from "app/vocabulary/actions/card/postponeRelatedCards";
import { deck } from "app/vocabulary/actions/deck";
import { canBeShown, showIn } from "app/vocabulary/actions/card/showIn";

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
  isNewCard() {
    return !(this.id in deck.schedule);
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
Card.prototype.showIn = showIn;
Card.prototype.canBeShown = canBeShown;

export default Card;
