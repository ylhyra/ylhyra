import { log } from "modules/log";
import {
  getData,
  getFrom,
  getTermIds,
} from "ylhyra/app/vocabulary/actions/card/card_data";
import { isNewCard } from "ylhyra/app/vocabulary/actions/card/card_schedule";
import { BAD } from "ylhyra/app/vocabulary/constants";
import CardInSession from "ylhyra/app/vocabulary/actions/cardInSession/index";

/**
 * @memberOf CardInSession#
 */
export function getRanking() {
  const card: CardInSession = this;

  const id = this.getId();
  const from = getFrom(id);
  let q = this.getQueuePosition();

  // New terms are not relevant unless there are no overdue cards
  if (
    !getTermIds(id).some((term_id) => term_id in this.session.lastSeenTerms)
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
  if (this.session.cardTypeLog[0] === from) {
    q += 0.4;
    if (this.session.cardTypeLog[1] === from) {
      /* Two in a row */
      if (this.hasBeenSeenInSession() || !isNewCard(id)) {
        q += 5;
      }

      /* Three new cards in a row */
      if (
        this.session.cardTypeLog[2] === from &&
        // Only if a user says "Good" to all three previous
        !this.session.ratingHistory.slice(0, 3).some((i) => i === BAD) &&
        // And all of them were new cards
        this.session.cardHistory
          .slice(0, 3)
          .every((i: CardInSession) => isNewCard(i.getId()))
      ) {
        q += 2000;
      }
    }
  }

  if (!getData(id, "isSentence")) {
    // A sentence should be shown if the userLevel was just increased
    if (this.session.wasEasinessLevelJustIncreased) {
      q += 200;
    }
    // Delay words if no sentence has been seen for a while
    else if (
      this.session.ratingHistory.length >= 3 &&
      // All last three cards were good
      !this.session.ratingHistory.slice(0, 3).some((i) => i === BAD) &&
      // And none were sentences
      this.session.cardHistory.slice(0, 3).every((i) => !i.isSentence)
    ) {
      q += 20;
      // Prevent English from showing up for unknown cards
      if (from === "en" || isNewCard(id)) {
        q += 20;
      }
    }
  }

  return q;
}
