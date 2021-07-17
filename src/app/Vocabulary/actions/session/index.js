/**
 * A single study session.
 */
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
import {
  updateRemainingTime,
  getAdjustedPercentageDone,
  printTimeRemaining,
  getCard,
  checkIfCardsRemaining,
  createMoreCards,
  getStatus,
  loadCard,
  answer,
} from "app/Vocabulary/actions/session/functions.js";
import {
  InitializeSession,
  loadCards,
} from "app/Vocabulary/actions/session/initialize.js";
import { nextCard } from "app/Vocabulary/actions/session/nextCard.js";
import { createSchedule } from "app/Vocabulary/actions/createSchedule.js";
import { updateURL } from "app/Router/actions";

export const MINUTES = 5;
export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;

class Session {
  constructor(deck) {
    // this.reset();
    this.deck = deck;
    this.loadSessionFromLocalStorage();
  }
  reset() {
    if (this.cards && this.cards.length > 0) {
      this.createSchedule();
    }
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
  sessionDone() {
    this.createSchedule();
    this.saveSession(null, true);
    updateURL(window.location.pathname);
    store.dispatch({
      type: "LOAD_SESSION",
      content: null,
    });
    this.reset();
  }
  saveSession(session, done) {
    // if (!done) {
    //   let to_save = session.cards.map(({ session, ...rest }) => rest);
    //   if (!to_save.some((i) => i.history.length > 0)) {
    //     to_save = null;
    //   }
    //   saveInLocalStorage("vocabulary-session", to_save);
    //   saveInLocalStorage("vocabulary-session-saved-at", new Date().getTime());
    // } else {
    //   saveInLocalStorage("vocabulary-session", null);
    // }
  }
  loadSessionFromLocalStorage() {
    // /* TODO: Clear after a day */
    // if (getFromLocalStorage("vocabulary-session")) {
    //   this.session.InitializeSession(
    //     getFromLocalStorage("vocabulary-session"),
    //     this
    //   );
    // }
  }
}

Session.prototype.createCards = createCards;
Session.prototype.updateRemainingTime = updateRemainingTime;
Session.prototype.getAdjustedPercentageDone = getAdjustedPercentageDone;
Session.prototype.printTimeRemaining = printTimeRemaining;
Session.prototype.getCard = getCard;
Session.prototype.checkIfCardsRemaining = checkIfCardsRemaining;
Session.prototype.createMoreCards = createMoreCards;
Session.prototype.getStatus = getStatus;
Session.prototype.loadCard = loadCard;
Session.prototype.answer = answer;
Session.prototype.InitializeSession = InitializeSession;
Session.prototype.loadCards = loadCards;
Session.prototype.nextCard = nextCard;
export default Session;
