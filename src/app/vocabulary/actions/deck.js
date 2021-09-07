import { isBrowser } from "app/app/functions/isBrowser";
import { saveInLocalStorage } from "app/app/functions/localStorage";
import { updateURL } from "app/router/actions/updateURL";
import Session from "app/vocabulary/actions/session";
import { Card } from "app/vocabulary/actions/card/card";
import { Term } from "app/vocabulary/actions/card/term";

export let deck;

/**
 * The deck contains all terms
 */
class Deck {
  constructor({ database, schedule, session, user_data }) {
    deck = this;

    this.cards = {};
    this.terms = {};
    Object.keys(database.cards).forEach(
      (card_id) => (this.cards[card_id] = new Card(database.cards[card_id]))
    );
    Object.keys(database.terms).forEach(
      (term_id) =>
        (this.terms[term_id] = new Term(database.terms[term_id], term_id))
    );
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
    updateURL("/vocabulary/play");
    this.session.reset();
    this.session.InitializeSession();
  }
  reset(options) {
    this.schedule = {};
    if (!options?.dontClear) {
      saveInLocalStorage("vocabulary-user-data", null);
      saveInLocalStorage("vocabulary-session", null);
    }
  }
}

export default Deck;

/* Hack used for server side rendering*/
export const setDeck = (j) => (deck = j);
