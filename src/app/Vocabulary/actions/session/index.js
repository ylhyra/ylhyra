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
import { undo, undoable, checkForUndoOnKeyDown } from "./undo";
import { SESSION_PREFIX, setUserData } from "app/Vocabulary/actions/sync";
export const MINUTES = process.env.NODE_ENV === "development" ? 2.5 : 5;
export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;

class Session {
  constructor(deck, init) {
    this.reset();
    this.deck = deck;
    /* Used to save the progress of a session that was prematurely closed */
    if (init?.cards) {
      Object.assign(this, init);
      this.sessionDone({ isInitializing: true });
    }
    // console.log({ session_log: this.deck.session_log });
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
    this.savedAt = null;
  }
  async sessionDone(options = {}) {
    await this.createSchedule();
    this.clearInLocalStorage();
    if (!options.isInitializing) {
      updateURL(window.location.pathname);
      store.dispatch({
        type: "LOAD_SESSION",
        content: null,
      });
    }
    /* Analytics */
    if (this.getSecondsSpent() > 20) {
      // TODO: Ignore logged in users?
      Analytics.log({
        type: "vocabulary",
        seconds: this.getSecondsSpent(),
      });
    }
    this.reset();
  }
  getSecondsSpent() {
    return Math.round(
      (this.totalTime - Math.max(0, this.remainingTime)) / 1000
    );
  }
  saveSessionInLocalStorage() {
    const session = this;
    let to_save = session.cards.map(({ session, ...rest }) => rest);
    if (!to_save.some((i) => i.history.length > 0)) {
      to_save = null;
    }
    saveInLocalStorage("vocabulary-session", {
      remainingTime: this.remainingTime,
      savedAt: new Date().getTime(),
      cards: to_save,
    });
  }
  clearInLocalStorage() {
    saveInLocalStorage("vocabulary-session", null);
  }
  saveSessionLog() {
    if (this.cardHistory.length > 0) {
      const timestamp = this.savedAt || new Date().getTime();
      const timestamp_in_seconds = Math.round(timestamp / 1000);
      setUserData(
        SESSION_PREFIX + timestamp_in_seconds,
        {
          seconds_spent: this.getSecondsSpent(),
          timestamp,
        },
        "session"
      );
    } else {
      console.log("Not logged");
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
Session.prototype.undo = undo;
Session.prototype.undoable = undoable;
Session.prototype.checkForUndoOnKeyDown = checkForUndoOnKeyDown;
export default Session;
