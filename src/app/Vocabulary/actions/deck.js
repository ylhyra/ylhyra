import store from "app/App/store";
import error from "app/App/Error";
import axios from "app/App/axios";
import { createSchedule } from "./createSchedule";
import Session, { MINUTES } from "app/Vocabulary/actions/session";
import { isBrowser } from "app/App/functions/isBrowser";
import { updateURL } from "app/Router/actions";
import { BAD, GOOD, EASY } from "./card";
import _ from "underscore";
import {
  keepTrackOfUserStatus,
  isEasinessLevelOn,
} from "app/Vocabulary/actions/easinessLevel";
import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/App/functions/localStorage";
import { saveUserDataInLocalStorage } from "app/Vocabulary/actions/sync.js";

export let deck;

/**
 * The deck contains all terms
 */
class Deck {
  constructor({
    database,
    schedule,
    session,
    session_log,
    easinessLevel,
    lastSynced,
  }) {
    deck = this;
    if (isBrowser) {
      window.deck = deck;
    }

    this.cards = database.cards;
    this.terms = database.terms;
    this.easinessLevel = easinessLevel || 0;
    this.lastSynced = lastSynced;
    this.session_log = session_log || [];

    this.cards_sorted = Object.keys(this.cards)
      .map((key) => {
        return this.cards[key];
      })
      .filter(Boolean)
      .sort((a, b) => a.sortKey - b.sortKey);

    this.schedule = schedule || {};
    this.session = new Session(deck, session);
  }
  saveSessionLog(ms) {
    this.session_log.push({
      seconds_spent: MINUTES * 60 - Math.max(0, Math.round(ms / 1000)),
      timestamp: new Date().getTime(),
      needsSyncing: true,
    });
  }
  continueStudying() {
    updateURL("VOCABULARY_PLAY");
    this.session.reset();
    this.session.InitializeSession();
  }
  // reset() {
  //   this.schedule = {};
  //   saveInLocalStorage("vocabulary-schedule", null);
  // }
}
Deck.prototype.keepTrackOfUserStatus = keepTrackOfUserStatus;
Deck.prototype.isEasinessLevelOn = isEasinessLevelOn;

export default Deck;

/* Hack used for server side rendering*/
export const setDeck = (j) => (deck = j);
