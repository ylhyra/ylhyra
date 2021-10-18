import { log } from "app/app/functions/log";
import { BAD } from "app/vocabulary/actions/cardInSession";

/**
 * @memberOf CardInSession#
 */
export function getRanking() {
  let q = this.getQueuePosition();

  if (!this.terms) {
    log(this);
    throw new Error("getRanking called on an uninitialized cardInSession");
  }

  // New terms are not relevant unless there are no overdue cards
  if (
    !this.getTermIds().some((term_id) => term_id in this.session.lastSeenTerms)
  ) {
    q += 1000;
  }

  // Seen cards
  else {
    /* Seen cards are not relevant if they are not overdue */
    if (q > 0 && this.canBeShown()) {
      q += 2000;
    }
  }

  if (!this.canBeShown()) {
    q += 3000;
  }

  /* A bad cardInSession that is due exactly now has priority */
  if (
    this.history[0] === BAD &&
    q === 0 &&
    this.session.counter % 2 === 0 /* (But not always, to prevent staleness) */
  ) {
    q -= 50;
  }

  if (this.done) {
    q += 7000;
  }

  /* Prevent rows of the same cardInSession type from appearing right next to each other too often */
  if (this.session.cardTypeLog[0] === this.from) {
    q += 0.4;
    if (this.session.cardTypeLog[1] === this.from) {
      /* Two in a row */
      if (this.hasBeenSeenInSession() || !this.isNewCard()) {
        q += 5;
      }

      /* Three in a row */
      if (
        this.session.cardTypeLog[2] === this.from &&
        // Only if a user says "Good" to all three previous
        !this.session.ratingHistory.slice(0, 3).some((i) => i === BAD) &&
        // And all of them were new cards
        this.session.cardHistory.slice(0, 3).every((i) => i.isNewCard())
      ) {
        q += 2000;
      }
    }
  }

  if (
    !this.isSentence &&
    (this.session.wasEasinessLevelJustIncreased ||
      (this.session.ratingHistory.length >= 3 &&
        // All last three cards were good
        !this.session.ratingHistory.slice(0, 3).some((i) => i === BAD) &&
        // And none were sentences
        this.session.cardHistory.slice(0, 3).every((i) => !i.isSentence) &&
        // Prevent English from showing up for unknown cards
        (this.from === "is" || !this.isNewCard())))
  ) {
    q += 20;
    /* Extra boost for when easiness level was increased */
    if (this.session.wasEasinessLevelJustIncreased) {
      q += 200;
    }
  }

  return q;
}
