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
import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/App/functions/localStorage";

export const MINUTES = process.env.NODE_ENV === "development" ? 2.5 : 5;
export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;

class Session {
  constructor(deck, init) {
    this.reset();
    this.deck = deck;
    if (init) {
      // this.loadCards(init);
      this.cards = init;
      this.createSchedule();
      this.saveSession(true);
      // this.reset();
    }
  }
  reset() {
    this.allowed_card_ids = null;
    this.ratingHistory = [];
    this.cardHistory = [];
    this.counter = 0;
    this.lastSeenTerms = {};
    this.cardTypeLog = [];
    this.currentCard = null;
    this.cards = [];
    this.timeStarted = new Date().getTime();
    this.totalTime = MINUTES * 60 * 1000;
    this.remainingTime = this.totalTime;
    this.lastTimestamp = new Date().getTime();
    this.done = false;
  }
  sessionDone() {
    this.createSchedule();
    this.saveSession(true);
    updateURL(window.location.pathname);
    store.dispatch({
      type: "LOAD_SESSION",
      content: null,
    });
    this.reset();
  }
  saveSession(clear) {
    const session = this;
    if (!clear) {
      let to_save = session.cards.map(({ session, ...rest }) => rest);
      if (!to_save.some((i) => i.history.length > 0)) {
        to_save = null;
      }
      saveInLocalStorage("vocabulary-session", to_save);
      saveInLocalStorage("vocabulary-session-saved-at", new Date().getTime());
    } else {
      saveInLocalStorage("vocabulary-session", null);
    }
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
Session.prototype.createSchedule = createSchedule;
export default Session;
