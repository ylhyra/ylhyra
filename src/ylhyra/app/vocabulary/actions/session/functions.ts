import { log } from "modules/log";
import { getTime } from "modules/time";
import CardInSession from "ylhyra/app/vocabulary/actions/cardInSession";
import { MAX_SECONDS_TO_COUNT_PER_ITEM } from "ylhyra/app/vocabulary/actions/session/index";

/**
 * @memberOf Session#
 */
export function updateRemainingTime() {
  const diff = Math.min(
    MAX_SECONDS_TO_COUNT_PER_ITEM * 1000,
    getTime() - this.lastTimestamp
  );
  this.remainingTime = Math.max(0, this.remainingTime - diff);
  this.lastTimestamp = getTime();
  if (this.remainingTime <= 0) {
    this.sessionDone();
    this.done = true;
  }
}

/**
 * @memberOf Session#
 */
export function getPercentageDone() {
  return ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
}

/**
 * @memberOf Session#
 * @return {void}
 */
export function checkIfCardsRemaining(): void {
  const areThereNewCardsRemaining = this.cards.some(
    (i: CardInSession) => !i.hasBeenSeenInSession() && !i.done && i.canBeShown()
  );
  if (!areThereNewCardsRemaining) {
    log("No cards remaining");
    this.createMoreCards();
  }
}

/**
 * @memberOf Session#
 */
export function createMoreCards() {
  this.createCards();
  log("New cards generated");
}

/**
 * @memberOf Session#
 */
export function answer(rating: number) {
  const session = this;
  session.currentCard?.rate(rating);
  session.nextCard();
  if (!session.done) {
    session.loadCardInInterface();
  }
}
