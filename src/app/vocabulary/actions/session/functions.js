import store from "app/app/store";
import { MAX_SECONDS_TO_COUNT_PER_ITEM } from "app/vocabulary/actions/session";
import { printWord, getTermsFromCards } from "app/vocabulary/actions/functions";

/**
 * @memberof Session
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
 * @memberof Session
 */
export function getAdjustedPercentageDone() {
  return ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
}

/**
 * @memberof Session
 */
export function getCard() {
  return this.currentCard;
}

/**
 * @memberof Session
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
 * @memberof Session
 */
export function createMoreCards() {
  this.createCards();
  console.log("New cards generated");
}

/**
 * @memberof Session
 */
export function loadCard() {
  const session = this;
  if (!session?.currentCard) return console.error("no cards");
  store.dispatch({
    type: "LOAD_CARD",
    content: {
      ...session.getCard(),
      counter: session.counter,
    },
  });
  if (process.env.NODE_ENV === "development") {
    console.log(
      getTermsFromCards(
        Object.keys(session.currentCard.dependenciesAndSameTerm)
      ).map(printWord)
    );
  }
  // if (
  //   this.deck.schedule[session.currentCard.id] &&
  //   process.env.NODE_ENV === "development"
  // ) {
  //   console.log(
  //     `Score of "${printWord(session.currentCard.id)}": ${
  //       this.deck.schedule[session.currentCard.id].score
  //     } - last interval: ${
  //       this.deck.schedule[session.currentCard.id].last_interval_in_days
  //     }`
  //   );
  // }
}

/**
 * @memberof Session
 */
export function answer(rating) {
  const session = this;
  session.currentCard.rate(rating);
  session.nextCard();
  if (!session.done) {
    session.loadCard();
  }
}
