import store from "app/App/store";
import _ from "underscore";
import Card, { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";
import {
  printWord,
  getCardsWithSameTerm,
} from "app/Vocabulary/actions/functions";
import { PercentageKnown } from "app/Vocabulary/actions/functions/percentageKnown";
import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";
import createCards from "app/Vocabulary/actions/createCards";
const LOGGING = false;

/**
 * @memberof Session
 */
export function nextCard(depth = 0) {
  // this.saveSnapshotForUndo();
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

  let ranked = this.cards
    .slice()
    .sort((a, b) => a.getRanking() - b.getRanking());
  this.currentCard = ranked[0];

  /* Logging */
  if ((LOGGING || window.logging) && process.env.NODE_ENV === "development") {
    const { deck } = this;
    console.table(
      ranked.map((i) => ({
        Rank: Math.round(i.getRanking()),
        Queue: i.absoluteQueuePosition - i.session.counter,
        Prohib: (i.cannotBeShownBefore || 0) - i.session.counter,
        new: i.history.length > 0 ? "SEEN" : "NEW",
        word: printWord(i.id),
        schdl: deck.schedule[i.id]
          ? new Date(deck.schedule[i.id].last_seen)
          : "",
      }))
    );
  }

  /* Store when this term was last seen */
  this.currentCard.terms.forEach((id) => {
    this.lastSeenTerms[id] = this.counter;
  });

  this.saveSessionInLocalStorage();
}
