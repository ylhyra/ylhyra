import { now } from "app/app/functions/time";
import { log } from "app/app/functions/log";
import { MAX_SECONDS_TO_COUNT_PER_ITEM } from "app/vocabulary/actions/session";

/**
 * @class Session.updateRemainingTime
 */
export function updateRemainingTime() {
  const newTimestamp = now();
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
 * @class Session.getPercentageDone
 */
export function getPercentageDone() {
  return ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
}

/**
 * @class Session.checkIfCardsRemaining
 */
export function checkIfCardsRemaining() {
  const areThereNewCardsRemaining = this.cards.some(
    (i) => i.history.length === 0 && !i.done && i.canBeShown()
  );
  if (!areThereNewCardsRemaining) {
    log("No cards remaining");
    this.createMoreCards();
  }
}

/**
 * @class Session.createMoreCards
 */
export function createMoreCards() {
  this.createCards();
  log("New cards generated");
}

/**
 * @class Session.answer
 */
export function answer(rating) {
  const session = this;
  session.currentCard?.rate(rating);
  session.nextCard();
  if (!session.done) {
    session.loadCardInInterface();
  }
}
