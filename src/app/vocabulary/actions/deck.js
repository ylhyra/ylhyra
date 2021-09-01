import store from "app/app/store";
import error from "app/app/error";
import axios from "app/app/axios";
import { createSchedule } from "./createSchedule";
import Session, { MINUTES } from "app/vocabulary/actions/session";
import { isBrowser } from "app/app/functions/isBrowser";
import { updateURL } from "app/router/actions";
import { BAD, GOOD, EASY } from "./card";
import _ from "underscore";
import {
  trackEasiness,
  isEasinessLevelOn,
} from "app/vocabulary/actions/easinessLevel";
import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/app/functions/localStorage";

export let deck;

/**
 * The deck contains all terms
 */
class Deck {
  constructor({ database, schedule, session, user_data }) {
    deck = this;

    this.cards = database.cards;
    this.terms = database.terms;
    this.user_data = user_data || {};
    this.schedule = schedule || {};
    this.session = new Session(deck, session);

    this.cards_sorted = Object.keys(this.cards)
      .map((key) => {
        return this.cards[key];
      })
      .filter(Boolean)
      .sort((a, b) => a.sortKey - b.sortKey);

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
