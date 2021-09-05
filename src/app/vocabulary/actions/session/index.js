import createCards from "app/vocabulary/actions/createCards";
import {
  updateRemainingTime,
  getAdjustedPercentageDone,
  checkIfCardsRemaining,
  createMoreCards,
  answer,
} from "app/vocabulary/actions/session/functions";
import { InitializeSession } from "app/vocabulary/actions/session/initialize";
import { nextCard } from "app/vocabulary/actions/session/nextCard";
import { createSchedule } from "app/vocabulary/actions/createSchedule";
import { updateURL } from "app/router/actions/updateURL";
import { saveInLocalStorage } from "app/app/functions/localStorage";
import Analytics from "app/app/analytics";
import {
  undo,
  undoable,
  checkForUndoOnKeyDown,
} from "app/vocabulary/actions/session/undo";
import { SESSION_PREFIX, setUserData } from "app/vocabulary/actions/sync";
import { loadCardsIntoSession } from "app/vocabulary/actions/session/loadCardsIntoSession";
import { loadCardInInterface } from "app/vocabulary/actions/session/loadCardInInterface";
export const MINUTES = process.env.NODE_ENV === "development" ? 4 : 5;
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
      let url = window.location.pathname;
      if (url === "/vocabulary/play") {
        url = "/vocabulary";
      }
      updateURL(url);
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

Session.prototype.InitializeSession = InitializeSession;
Session.prototype.answer = answer;
Session.prototype.checkForUndoOnKeyDown = checkForUndoOnKeyDown;
Session.prototype.checkIfCardsRemaining = checkIfCardsRemaining;
Session.prototype.createCards = createCards;
Session.prototype.createMoreCards = createMoreCards;
Session.prototype.createSchedule = createSchedule;
Session.prototype.getAdjustedPercentageDone = getAdjustedPercentageDone;
Session.prototype.loadCardInInterface = loadCardInInterface;
Session.prototype.loadCardsIntoSession = loadCardsIntoSession;
Session.prototype.nextCard = nextCard;
Session.prototype.undo = undo;
Session.prototype.undoable = undoable;
Session.prototype.updateRemainingTime = updateRemainingTime;
export default Session;
