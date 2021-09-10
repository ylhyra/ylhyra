import getRanking from "app/vocabulary/actions/cardInSession/getRanking";
import rate from "app/vocabulary/actions/cardInSession/rate";
import postponeRelatedCards from "app/vocabulary/actions/cardInSession/postponeRelatedCards";
import { deck } from "app/vocabulary/actions/deck";
import {
  canBeShown,
  showIn,
} from "app/vocabulary/actions/cardInSession/showIn";
import { Card } from "app/vocabulary/actions/card/card";

export const BAD = 1;
export const GOOD = 2;
export const EASY = 3;

class CardInSession extends Card {
  constructor({ data, insertAtPosition, session, history }) {
    super(data);
    this.session = session;
    this.history = history || [];
    this.absoluteQueuePosition = session?.counter || 0 + insertAtPosition;
  }
  isNewTerm() {
    // There exists at least one term
    return this.terms.some((term_id) =>
      // Where every cardInSession is new
      deck.terms[term_id].cards.every(
        (card_id) =>
          !(card_id in deck.schedule) &&
          !this.session.cards.some(
            (c) => c.id === card_id && c.wasSeenInSession()
          )
      )
    );
  }
  wasSeenInSession() {
    return this.history.length > 0;
  }
  getOtherCardsInSession() {
    return deck.session.cards.filter((card) => card.getId() !== this.getId());
  }
  getQueuePosition() {
    return this.absoluteQueuePosition - this.session.counter;
  }
  setQueuePosition(interval) {
    this.absoluteQueuePosition = this.session.counter + interval;
  }
  setCannotBeShownBefore(interval) {
    this.cannotBeShownBefore = Math.max(
      this.cannotBeShownBefore || 0,
      this.session.counter + interval
    );
  }
}

CardInSession.prototype.rate = rate;
CardInSession.prototype.getRanking = getRanking;
CardInSession.prototype.postponeRelatedCards = postponeRelatedCards;
// CardInSession.prototype.showIn = showIn;
CardInSession.prototype.canBeShown = canBeShown;

export default CardInSession;
