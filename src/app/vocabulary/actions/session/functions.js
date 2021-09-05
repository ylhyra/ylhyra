import store from "app/app/store";
import { MAX_SECONDS_TO_COUNT_PER_ITEM } from "app/vocabulary/actions/session";
import { printWord, getTermsFromCards } from "app/vocabulary/actions/functions";
import { loadCardInInterface } from "app/vocabulary/actions/session/loadCardInInterface";

/**
 * @module Session
 */
export function updateRemainingTime() {
  const newTimestamp = new Date().getTime();
  const diff = Math.min(
    MAX_SECONDS_TO_COUNT_PER_ITEM * 1000,
    newTimestamp - this.lastTimestamp
  );
  this.remainingTime = Math.max(0, this.remainingTime - diff);
  this.lastTimestamp = newTimestamp;
  if (this.remainingTime <= 0) {
    this.sessionDone();
    this.done = true;
  }
}

/**
 * @module Session
 */
export function getAdjustedPercentageDone() {
  return ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
}

/**
 * @module Session
 */
export function checkIfCardsRemaining() {
  const areThereNewCardsRemaining = this.cards.some(
    (i) => i.history.length === 0 && !i.done && i.canBeShown()
  );
  if (!areThereNewCardsRemaining) {
    console.log("No cards remaining");
    this.createMoreCards();
  }
}

/**
 * @module Session
 */
export function createMoreCards() {
  this.createCards();
  console.log("New cards generated");
}

/**
 * @module Session
 */
export function answer(rating) {
  const session = this;
  session.currentCard?.rate(rating);
  session.nextCard();
  if (!session.done) {
    session.loadCardInInterface();
  }
}
