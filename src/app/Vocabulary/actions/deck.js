import store from "app/App/store";
import error from "app/App/Error";
import axios from "app/App/axios";
import { createSchedule } from "./createSchedule";
import Session from "app/Vocabulary/actions/session";
import { isBrowser } from "app/App/functions/isBrowser";
import { syncSchedule } from "./sync";
import { updateURL } from "app/Router/actions";
import { BAD, GOOD, EASY } from "./card";
import _ from "underscore";
import {
  keepTrackOfUserStatus,
  isEasinessLevelOn,
} from "app/Vocabulary/actions/tooEasy";

export let deck;

/**
 * The deck contains all terms
 */
class Deck {
  constructor({ database, schedule, session }) {
    deck = this;
    if (isBrowser) {
      window.deck = deck;
    }

    this.cards = database.cards;
    this.terms = database.terms;

    this.cards_sorted = Object.keys(this.cards)
      .map((key) => {
        return this.cards[key];
      })
      .filter(Boolean)
      .sort((a, b) => a.sortKey - b.sortKey);

    this.schedule = schedule || {};
    this.session = new Session(deck, session);
  }
  continueStudying() {
    updateURL("VOCABULARY_PLAY");
    this.session.reset();
    this.session.InitializeSession();
  }
  reset() {
    this.schedule = {};
  }
}
Deck.prototype.syncSchedule = syncSchedule;
Deck.prototype.keepTrackOfUserStatus = keepTrackOfUserStatus;
Deck.prototype.isEasinessLevelOn = isEasinessLevelOn;

export default Deck;

/* Hack used for server side rendering*/
export const setDeck = (j) => (deck = j);
