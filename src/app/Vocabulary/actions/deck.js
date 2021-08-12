/**
 * The deck contains *all* terms
 */
import store from "app/App/store";
import error from "app/App/Error";
import axios from "app/App/axios";
import { createSchedule } from "./createSchedule";
import Session from "app/Vocabulary/actions/session";
import { isBrowser } from "app/App/functions/isBrowser";

import { syncSchedule } from "./sync";
// import { spreadOutSchedule } from "./createSchedule";
import { updateURL } from "app/Router/actions";
import { BAD, GOOD, EASY } from "./card";
import _ from "underscore";

export let deck;

class Deck {
  constructor(database, schedule, session) {
    deck = this;
    if (isBrowser) {
      window.deck = deck;
    }

    const { cards, terms } = database;
    this.cards = cards;
    this.terms = terms;

    this.cards_sorted = Object.keys(cards)
      .map((key) => {
        // if(typeof cards[key] === 'function') return null;
        return cards[key];
      })
      .sort((a, b) => a.sortKey - b.sortKey)
      .filter(Boolean);
    this.schedule = schedule || {};
    this.session = new Session(deck, session);
  }
  // play() {
  //   this.session.InitializeSession();
  // }
  continueStudying() {
    updateURL("VOCABULARY_PLAY");
    this.session.reset();
    this.session.InitializeSession();
  }
}
Deck.prototype.syncSchedule = syncSchedule;

export const setDeck = (j) => (deck = j);
// Deck.prototype.spreadOutSchedule = spreadOutSchedule;
export default Deck;
