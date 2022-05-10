import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { Rating } from "flashcards/flashcards/types";

/**
 * Returns a ranking for a given {@link CardInSession} indicating
 * how likely it is that it should be chosen as the next card:
 *   - A low ranking (close to zero) indicates that it should be chosen.
 *   - A high ranking indicates it should NOT be chosen.
 *
 * Each card has a queue position (see {@link getQueuePosition}),
 * but here we add or subtract to that value based on whether it is actually relevant,
 * such as preferring overdue cards and prohibiting cards that are too recent.
 */
export function getRanking(this: CardInSession) {
  const session = getSession();
  const direction = this.direction;

  /**
   * Starts out as the card's queue position.
   * A card is overdue if its queue position is less than 0.
   * If the queue position is 0, the card is due now.
   */
  let rank = this.getQueuePosition();

  /**
   * Rows that haven't already been seen in this session
   * are moved back in the queue. They will only be shown
   * if there are no overdue seen rows (non-overdue seen rows
   * are moved back in the next step).
   */
  if (!this.hasRowBeenSeenInSession()) {
    rank += 1000;
  }

  /**
   * Seen rows are not relevant if they are not overdue.
   */
  if (this.hasRowBeenSeenInSession() && !this.isOverdueInCurrentSession()) {
    rank += 2000;
  }

  /**
   * Sees if there is a hard limit in place
   * in {@link CardInSession.cannotBeShownBefore}
   */
  if (!this.canBeShown()) {
    rank += 10000;
  }

  /**
   * A bad cardInSession that is due exactly now has priority
   */
  if (
    this.history[0] === Rating.BAD &&
    this.isDueExactlyNow() &&
    session.counter % 2 === 0 /* (But not always, to prevent staleness) */
  ) {
    rank -= 50;
  }

  if (this.done) {
    rank += 7000;
  }

  /**
   * Prevent cards all going in the same direction
   * from appearing right next to each other too often
   */
  if (session.cardDirectionLog[0] === direction) {
    rank += 0.4;
    /* Two in a row */
    if (session.cardDirectionLog[1] === direction) {
      if (this.hasBeenSeenInSession() || !this.isNewCard()) {
        rank += 5;
      }

      /* Three new cards in a row */
      if (
        session.cardDirectionLog[2] === direction &&
        // Only if a user says "Good" or "Easy" to all three previous
        !session.ratingHistory.slice(0, 3).some((i) => i === Rating.BAD) &&
        // And all of them were new cards
        session.cardHistory
          .slice(0, 3)
          .every((i: CardInSession) => i.isNewCard())
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
  //     if (from === "en" || id.isNewCard()) {
  //       q += 20;
  //     }
  //   }
  // }

  return rank;
}
