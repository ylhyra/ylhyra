// /**
//  * @property {boolean} done
//  * @property {Session} session
//  * @property {Array.<number>} history
//  * @property {number} absoluteQueuePosition
//  */
import { postponeRelatedCards } from "app/vocabulary/actions/cardInSession/postponeRelatedCards";
import { showIn } from "app/vocabulary/actions/cardInSession/showIn";
import { rate } from "app/vocabulary/actions/cardInSession/rate";
import { getRanking } from "app/vocabulary/actions/cardInSession/getRanking";

class CardInSession {
  constructor({ id, insertAtPosition, session, history }) {
    this.session = session;
    this.history = history || [];
    this.absoluteQueuePosition =
      (session?.counter || 0) + (insertAtPosition || 0);
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

  getRanking = getRanking;
  rate = rate;
  postponeRelatedCards = postponeRelatedCards;
  showIn = showIn;
}

export default CardInSession;
