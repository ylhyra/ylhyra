/**
 * A single study session.
 */
import store from "app/App/store";
import _ from "underscore";
import Card, { BAD, GOOD, EASY } from "./card";
import {
  printWord,
  getCardsWithSameTerm,
  // filterOnlyCardsThatExist,
} from "./functions";
import { PercentageKnown } from "app/Vocabulary/actions/functions/percentageKnown";
import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";
import createCards from "./createCards";

export const MINUTES = 5;
export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;
const LOGGING = false;

class Session {
  constructor(deck) {
    this.reset();
    this.deck = deck;
  }
  reset() {
    this.allowed_card_ids = null;
    this.history = [];
    this.counter = 0;
    this.lastSeenTerms = {};
    this.cardTypeLog = [];
    this.currentCard = null;
    this.cards = [];
    this.timeStarted = new Date().getTime();
    this.totalTime = MINUTES * 60 * 1000;
    this.remainingTime = this.totalTime;
    this.lastTimestamp = new Date().getTime();
  }
  next(depth = 0) {
    this.counter++;
    this.updateRemainingTime();
    if (this.cards.length === 0) {
      console.error("No cards");
      this.createMoreCards();
      /* Prevent infinite calls */
      if (depth === 0) {
        this.next(1);
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
      const deck = this.deck;
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

    this.deck.saveSession(this);
  }
}

Session.prototype.updateRemainingTime = function () {
  const newTimestamp = new Date().getTime();
  const diff = Math.min(
    MAX_SECONDS_TO_COUNT_PER_ITEM * 1000,
    newTimestamp - this.lastTimestamp
  );
  this.remainingTime = Math.max(0, this.remainingTime - diff);
  this.lastTimestamp = newTimestamp;
  if (this.remainingTime <= 0) {
    this.deck.sessionDone();
    this.done = true;
  }
};

Session.prototype.getAdjustedPercentageDone = function () {
  return ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
};

Session.prototype.printTimeRemaining = function () {
  const time = Math.floor(this.remainingTime / 1000) || 1;
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:${("0" + seconds).slice(-2)}`;
  // return `${minutes} minute${minutes===1?'':''}, ${('0'+seconds).slice(-2)} second${seconds===1?'s':''}`
};

Session.prototype.getCard = function () {
  return this.currentCard;
};

Session.prototype.checkIfCardsRemaining = function () {
  const areThereNewCardsRemaining = this.cards.some(
    (i) => i.history.length === 0 && !i.done && i.canBeShown()
  );
  if (!areThereNewCardsRemaining) {
    this.createMoreCards();
  }
};

Session.prototype.createMoreCards = function () {
  this.createCards();
  console.log("New cards generated");
};

Session.prototype.getStatus = function () {
  return {
    bad: this.cards.filter((card) => card.getStatus() === BAD).length,
    good: this.cards.filter((card) => card.getStatus() === GOOD).length,
    easy: this.cards.filter((card) => card.getStatus() === EASY).length,
    total: this.cards.length,
    wordsTotal: _.uniq(_.flatten(this.cards.map((i) => i.terms))).length,
    counter: this.counter,
  };
};

Session.prototype.loadCard = function () {
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
};

Session.prototype.answer = function (rating) {
  const session = this;
  session.currentCard.rate(rating);
  session.next();
  if (!session.done) {
    session.loadCard();
  }
};

Session.prototype.InitializeSession = function (input) {
  const session = this;
  // session.allowed_card_ids = null;
  if (Array.isArray(input)) {
    session.cards = input;
  }
  session.checkIfCardsRemaining();
  session.next();
  store.dispatch({
    type: "LOAD_SESSION",
    content: session,
  });
  session.loadCard();
};

Session.prototype.loadCards = function (card_ids, options) {
  let insertAtPosition = this.cards.filter((i) => !i.done).length;
  if (insertAtPosition) {
    insertAtPosition += 200;
  }

  card_ids.forEach((id, index) => {
    if (!(id in this.deck.cards)) return;
    if (this.cards.some((c) => c.id === id)) return;
    const card = new Card(
      {
        id,
        ...this.deck.cards[id],
        dependencyDepth: withDependencies(id, { showDepth: true }),
      },
      index + insertAtPosition,
      this
    );
    this.cards.push(card);
  });
};

Session.prototype.createCards = createCards;
export default Session;
