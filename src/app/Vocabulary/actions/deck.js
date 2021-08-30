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
  trackEasiness,
  isEasinessLevelOn,
} from "app/Vocabulary/actions/easinessLevel";
import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/App/functions/localStorage";

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

    if (isBrowser) {
      window.deck = this;
    }
  }
  continueStudying() {
    updateURL("VOCABULARY_PLAY");
    this.session.reset();
    this.session.InitializeSession();
  }
  reset() {
    this.schedule = {};
    this.session_log = [];
    this.easinessLevel = 0;
    saveInLocalStorage("vocabulary-schedule", null);
    saveInLocalStorage("vocabulary-session", null);
  }
}
Deck.prototype.trackEasiness = trackEasiness;
Deck.prototype.isEasinessLevelOn = isEasinessLevelOn;

export default Deck;

/* Hack used for server side rendering*/
export const setDeck = (j) => (deck = j);
