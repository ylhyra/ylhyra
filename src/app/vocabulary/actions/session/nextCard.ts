import { printWord } from "app/vocabulary/actions/functions";
import { isDev } from "app/app/functions/isDev";
import _ from "underscore";

let LOGGING;
// LOGGING = true;

/**
 * @memberOf Session#
 * @this Session
 */
export function nextCard(depth = 0) {
  this.counter++;
  this.updateRemainingTime();
  if (this.done) return;
  if (this.cards.length === 0) {
    console.error("No cards");
    this.createMoreCards();
    /* Prevent infinite calls */
    if (depth === 0) {
      this.nextCard(1);
    } else {
      throw new Error("Failed to generate cards");
      // TODO User-facing error?
    }
    return;
  } else {
    this.checkIfCardsRemaining();
  }

  this.currentCard = _.min(this.cards, (i) => i.getRanking());

  /* Logging */
  if ((LOGGING || window.logging) && isDev) {
    const { deck } = this;
    console.table(
      _.sortBy(this.cards, (i) => i.getRanking()).map((i) => ({
        Rank: Math.round(i.getRanking()),
        Queue: i.absoluteQueuePosition - i.session.counter,
        Prohib: (i.cannotBeShownBefore || 0) - i.session.counter,
        seen: i.hasBeenSeenInSession() ? "SEEN" : "",
        word: printWord(i.getId()),
        sortKey: i.getSortKey(),
        schdl: deck.schedule[i.getId()] ? new Date(i.getLastSeen()) : "",
      }))
    );
  }

  /* Store when this term was last seen */
  this.currentCard.getTermIds().forEach((id) => {
    this.lastSeenTerms[id] = this.counter;
  });

  this.wasEasinessLevelJustIncreased = false;
  this.saveSessionInLocalStorage();
}
