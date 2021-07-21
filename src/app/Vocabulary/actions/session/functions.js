import store from "app/App/store";
import _ from "underscore";
import Card, { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";
import {
  printWord,
  getCardsWithSameTerm,
  // filterOnlyCardsThatExist,
} from "app/Vocabulary/actions/functions";
import { PercentageKnown } from "app/Vocabulary/actions/functions/percentageKnown";
import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";
import createCards from "app/Vocabulary/actions/createCards";
import { MAX_SECONDS_TO_COUNT_PER_ITEM } from "app/Vocabulary/actions/session/index.js";

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
export function printTimeRemaining() {
  const time = Math.floor(this.remainingTime / 1000) || 1;
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:${("0" + seconds).slice(-2)}`;
  // return `${minutes} minute${minutes===1?'':''}, ${('0'+seconds).slice(-2)} second${seconds===1?'s':''}`
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
export function getStatus() {
  return {
    bad: this.cards.filter((card) => card.getStatus() === BAD).length,
    good: this.cards.filter((card) => card.getStatus() === GOOD).length,
    easy: this.cards.filter((card) => card.getStatus() === EASY).length,
    total: this.cards.length,
    wordsTotal: _.uniq(_.flatten(this.cards.map((i) => i.terms))).length,
    counter: this.counter,
  };
}

/**
 * @memberof Session
 */
export function loadCard() {
  const session = this;
  if (!session || !session.currentCard) return console.error("no cards");
  store.dispatch({
    type: "LOAD_CARD",
    content: {
      ...session.getCard(),
      counter: session.counter,
      status: session.getStatus(),
    },
  });
  if (
    this.deck.schedule[session.currentCard.id] &&
    process.env.NODE_ENV === "development"
  ) {
    console.log(
      `Score of current card: ${
        this.deck.schedule[session.currentCard.id].score
      }`
    );
  }
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
