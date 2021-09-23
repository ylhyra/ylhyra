import Card from "app/vocabulary/actions/card/card";
import { extendPrototype } from "app/app/functions/extendPrototype";
import Session from "app/vocabulary/actions/session";

export const BAD = 1;
export const GOOD = 2;
export const EASY = 3;

/**
 * @property {boolean} done
 * @property {Session} session
 * @property {Array.<number>} history
 * @property {number} absoluteQueuePosition
 * @augments Card#
 */
class CardInSession extends Card {
  constructor({ data, insertAtPosition, session, history }) {
    super(data);
    this.session = session;
    this.history = history || [];
    this.absoluteQueuePosition =
      (session?.counter || 0) + (insertAtPosition || 0);
  }

  /**
   * @returns {boolean}
   */
  isNewTerm() {
    // There exists at least one term
    return this.getTerms().some((term) =>
      // Where every cardInSession is new
      term
        .getCards()
        .every(
          (card) =>
            !card.isInSchedule() &&
            !card.getAsCardInSession()?.hasBeenSeenInSession()
        )
    );
  }

  /**
   * @returns {boolean}
   */
  hasBeenSeenInSession() {
    return this.history.length > 0;
  }

  /**
   * @returns {Array.<CardInSession>}
   */
  getOtherCardsInSession() {
    return this.session.cards.filter((card) => card.getId() !== this.getId());
  }

  /**
   * @returns {number}
   */
  getQueuePosition() {
    return this.absoluteQueuePosition - this.session.counter;
  }

  /**
   * @param {number} interval
   */
  setQueuePosition(interval) {
    this.absoluteQueuePosition = this.session.counter + interval;
  }

  /**
   * @param {number} interval
   */
  setCannotBeShownBefore(interval) {
    this.cannotBeShownBefore = Math.max(
      this.cannotBeShownBefore || 0,
      this.session.counter + interval
    );
  }
}

extendPrototype(
  CardInSession,
  require("app/vocabulary/actions/cardInSession/getRanking"),
  require("app/vocabulary/actions/cardInSession/rate"),
  require("app/vocabulary/actions/cardInSession/postponeRelatedCards"),
  require("app/vocabulary/actions/cardInSession/showIn")
);

export default CardInSession;
