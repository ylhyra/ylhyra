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
  loadCard,
  answer,
} from "app/Vocabulary/actions/session/functions";
import {
  InitializeSession,
  loadCards,
} from "app/Vocabulary/actions/session/initialize";
import { nextCard } from "app/Vocabulary/actions/session/nextCard";
import { createSchedule } from "app/Vocabulary/actions/createSchedule";
import { updateURL } from "app/Router/actions";
import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/App/functions/localStorage";
import Analytics from "app/Analytics";

export const MINUTES = process.env.NODE_ENV === "development" ? 2.5 : 5;
export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;

class Session {
  constructor(deck, init) {
    this.reset();
    this.deck = deck;
    if (init) {
      this.cards = init;
      this.createSchedule();
      this.clearInLocalStorage();
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
    this.lastUndid = 0;
  }
  sessionDone() {
    this.createSchedule();
    this.clearInLocalStorage();
    updateURL(window.location.pathname);
    store.dispatch({
      type: "LOAD_SESSION",
      content: null,
    });
    /* Analytics */
    const seconds_spent = Math.round(
      (this.totalTime - Math.max(0, this.remainingTime)) / 1000
    );
    if (seconds_spent > 20) {
      Analytics.log({
        type: "vocabulary",
        seconds: seconds_spent,
      });
    }
    this.reset();
  }
  saveSessionInLocalStorage() {
    const session = this;
    let to_save = session.cards.map(({ session, ...rest }) => rest);
    if (!to_save.some((i) => i.history.length > 0)) {
      to_save = null;
    }
    saveInLocalStorage("vocabulary-session", to_save);
    saveInLocalStorage("vocabulary-session-remaining", this.remainingTime);
  }
  clearInLocalStorage() {
    saveInLocalStorage("vocabulary-session", null);
    saveInLocalStorage("vocabulary-session-remaining", null);
  }
  undo() {
    const card = this.cardHistory[0];
    if (!card) return;
    card.history.shift();
    this.currentCard = card;
    this.cardHistory.shift();
    this.lastUndid = this.counter;
    this.loadCard();
  }
  undoable() {
    // if (!(this.lastUndid !== this.counter)) {
    //   console.warn("Unmatching counter");
    // }
    return this.cardHistory.length > 0 && this.lastUndid !== this.counter;
  }
  keyDown(e) {
    if (
      e.keyCode === 90 &&
      (e.ctrlKey || e.metaKey) &&
      !e.altKey &&
      this.undoable()
    ) {
      e.preventDefault();
      this.undo();
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
Session.prototype.loadCard = loadCard;
Session.prototype.answer = answer;
Session.prototype.InitializeSession = InitializeSession;
Session.prototype.loadCards = loadCards;
Session.prototype.nextCard = nextCard;
Session.prototype.createSchedule = createSchedule;
export default Session;
