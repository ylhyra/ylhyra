import { isNewCard } from "flashcards/flashcards/actions/card/cardSchedule";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getDirectionFromCardId } from "flashcards/flashcards/compile/ids";
import { getSession } from "flashcards/flashcards/sessionStore";
import { Rating } from "flashcards/flashcards/types/types";

/**
 * Returns a ranking for a given {@link CardInSession} indicating
 * how likely it is that it should be chosen as the next card:
 *   - A low ranking (close to zero) indicates that it should be chosen.
 *   - A high ranking indicates it should NOT be chosen.
 *
 * Each card has a queue position (see {@link getQueuePosition}),
 * but here we add or subtract to that value based on whether it is actually relevant:
 *   - Seen cards are not relevant if they are not overdue
 *   - New terms are not relevant unless there are no overdue cards
 *   - A card that is "done" should never be chosen if there are other availabilities
 *   - A card may be marked as being absolutely prohibited from being shown
 *     until a later time ({@see canBeShown}), meaning that cards later in the queue
 *     will be chosen instead.
 */
export function getRanking(this: CardInSession) {
  const session = getSession();
  const direction = getDirectionFromCardId(this.cardId);

  /**
   * Starts out as the card's queue position.
   * If the queue position is 0, the card is up
   * A card is overdue if its queue position is less than 0.
   */
  let q = this.getQueuePosition();

  /**
   * New terms are not relevant unless there are no overdue cards
   */
  if (!this.hasTermBeenSeenInSession()) {
    q += 1000;
  }

  // Seen cards
  else {
    /* Seen cards are not relevant if they are not overdue */
    if (q > 0 && this.canBeShown()) {
      q += 2000;
    }
  }

  /** A card may be marked as being absolutely prohibited from being shown
      until a later time */
  if (!this.canBeShown()) {
    q += 3000;
  }

  /* A bad cardInSession that is due exactly now has priority */
  if (
    this.history[0] === Rating.BAD &&
    q === 0 &&
    session.counter % 2 === 0 /* (But not always, to prevent staleness) */
  ) {
    q -= 50;
  }

  if (this.done) {
    q += 7000;
  }

  /* Prevent rows of the same cardInSession type from appearing right next to each other too often */
  if (session.cardDirectionLog[0] === direction) {
    q += 0.4;
    if (session.cardDirectionLog[1] === direction) {
      /* Two in a row */
      if (this.hasBeenSeenInSession() || !isNewCard(this.cardId)) {
        q += 5;
      }

      /* Three new cards in a row */
      if (
        session.cardDirectionLog[2] === direction &&
        // Only if a user says "Good" to all three previous
        !session.ratingHistory.slice(0, 3).some((i) => i === Rating.BAD) &&
        // And all of them were new cards
        session.cardHistory
          .slice(0, 3)
          .every((i: CardInSession) => isNewCard(i.cardId))
      ) {
        q += 2000;
      }
    }
  }

  // TODO
  // if (!getCardData(id, "isSentence")) {
  //   // A sentence should be shown if the userLevel was just increased
  //   if (false /*session.wasEasinessLevelJustIncreased*/) {
  //     q += 200;
  //   }
  //   // Delay words if no sentence has been seen for a while
  //   else if (
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
  //     if (from === "en" || isNewCard(id)) {
  //       q += 20;
  //     }
  //   }
  // }

  return q;
}
