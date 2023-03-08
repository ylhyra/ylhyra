import {
  isNewCard,
  isNewRow,
  isOverdueGood,
  isOverdueBad,
} from "flashcards/flashcards/actions/card/cardSchedule";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { Rating } from "flashcards/flashcards/types";

/**
 * Returns a ranking for a given {@link CardInSession} indicating how likely it
 * is that it should be chosen as the next card:
 *
 * - A low ranking (close to zero) indicates that it should be chosen.
 * - A high ranking indicates it should NOT be chosen.
 *
 * Each card has a queue position (see {@link CardInSession#queuePosition}), but
 * here we add or subtract to that value based on whether it is actually
 * relevant, such as preferring overdue cards and prohibiting cards that are too recent.
 *
 * There are four categories of cards which are initially loaded into the
 * session: overdue good, overdue bad, new, and not overdue. At each step, one
 * category may be preferred over another.
 */
export function getRanking(this: CardInSession) {
  const session = this.session;
  const direction = this.direction;

  /**
   * Starts out as the card's queue position. A card is overdue (in this
   * session) if its queue position is less than 0. If the queue position is 0,
   * the card is due now.
   */
  let rank = this.queuePosition;

  /**
   * Rows that haven't already been seen in this session are moved back in the
   * queue. They will only be shown if there are no overdue seen rows
   * (non-overdue seen rows are moved back in the next step).
   */
  if (!this.hasRowBeenSeenInSession()) {
    rank += 1000;

    const wasOverdueGoodChosenMoreRecentlyThanOverdueBad = (() => {
      const i1 = session.addedCardLog.findIndex(
        (type) => type === "OVERDUE_GOOD",
      );
      const i2 = session.addedCardLog.findIndex(
        (type) => type === "OVERDUE_BAD",
      );
      if (i1 < 0 || i2 < 0) {
        return false;
      } else {
        return i1 < i2;
      }
    })();

    if (isNewRow(this)) {
      if (session.addedCardLog.length % 3 === 1) {
        rank -= 500;
      }
    } else if (isOverdueGood(this)) {
      /** Try to alternate between choosing overdue good and overdue bad */
      if (!wasOverdueGoodChosenMoreRecentlyThanOverdueBad) {
        rank -= 300;
      }
    } else if (isOverdueBad(this)) {
      if (wasOverdueGoodChosenMoreRecentlyThanOverdueBad) {
        rank -= 300;
      }
    } else {
      /** Not overdue: Showing these is last resort when no other cards are available */
      rank += 10_000;
    }
  }

  // /** Seen rows are not relevant if they are not overdue. */
  // if (this.hasRowBeenSeenInSession() && this.queuePosition > 0) {
  //   rank += 100_000;
  // }

  // /**
  //  * Sees if there is a hard limit in place in
  //  * {@link CardInSession.#cannotBeShownUntilRelativeToCounter}
  //  */
  // if (!this.canBeShown) {
  //   rank += 100_000;
  // }

  /** Prioritize cards whose last rating was bad */
  if (
    this.thisAndSiblingCardsInSession.some(
      (c) => c.lastRating === Rating.BAD,
    ) &&
    session.counter % 4 !== 0 /* (But not always, to prevent staleness) */
  ) {
    rank -= 100;
    /** Give priority to a card that is due exactly now */
    if (this.thisAndSiblingCardsInSession.some((c) => c.isDueExactlyNow())) {
      rank -= 50;
    }
  }

  // /** Choose which side to show first */
  // TODO: Incorrectly gives +100 to all new cards
  // if (
  //   isNewCard(this) &&
  //   this.row.getSetting("sideToShowFirst") !== "RANDOM" &&
  //   this.row.getSetting("sideToShowFirst") !== this.direction
  // ) {
  //   rank += 100;
  // }

  /**
   * Prevent cards all going in the same direction from appearing right next to
   * each other too often
   */
  if (
    session.history.cardDirectionLog.length > 0 &&
    session.history.cardDirectionLog[0] === direction
  ) {
    rank += 0.4;
    /* Two in a row */
    if (
      session.history.cardDirectionLog.length > 1 &&
      session.history.cardDirectionLog[1] === direction
    ) {
      if (this.hasBeenSeenInSession || !isNewCard(this)) {
        rank += 5;
      }

      /* Three new cards in a row */
      if (
        session.history.cardDirectionLog.length > 2 &&
        session.history.cardDirectionLog[2] === direction &&
        // Only if a user says "Good" or "Easy" to all three previous
        !session.history.ratingHistory
          .slice(0, 3)
          .some((i) => i === Rating.BAD) &&
        // And all of them were new cards
        session.history.cardHistory
          .slice(0, 3)
          .every((i: CardInSession) => isNewCard(i))
      ) {
        rank += 2000;
      }
    }
  }

  // TODO Delay words if no sentence has been seen for a while
  // if (!getCardData(id, "isSentence")) {
  //   if (
  //     session.ratingHistory.length >= 3 &&
  //     // All last three cards were good
  //     !session.ratingHistory.slice(0, 3).some((i) => i === Rating.BAD) &&
  //     // And none were sentences
  //     session.cardHistory
  //       .slice(0, 3)
  //       .every((i) => !getCardData(i.id, "isSentence"))
  //   ) {
  //     q += 20;
  //     // Prevent English from showing up for unknown cards
  //     if (from === "en" || isNewCard(id,)) {
  //       q += 20;
  //     }
  //   }
  // }

  return rank;
}
