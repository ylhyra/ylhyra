import { isBrowser } from "app/app/functions/isBrowser";
import { saveInLocalStorage } from "app/app/functions/localStorage";
import { updateURL } from "app/router/actions/updateURL";
import Session from "app/vocabulary/actions/session";
import Card from "app/vocabulary/actions/card/card";
import { Term } from "app/vocabulary/actions/card/term";
import { countTerms } from "app/vocabulary/actions/functions";
import { warnIfSlow } from "app/app/functions/warnIfSlow";

/**
 * @type {Deck|undefined}
 */
export let deck;

/**
 * @property {Object.<string, Card>} cards
 * @property {Array.<Card>} cards_sorted
 * @property {Object.<string, Term>} terms
 * @property {Object.<CardID, ScheduleData>} schedule
 * @property {UserData} user_data
 * @property {Session} session
 */
class Deck {
  constructor({ database, schedule, session, user_data }) {
    warnIfSlow.start("Deck");
    deck = this;
    this.cards = {};
    this.terms = {};

    // this.cards_temp = database.cards;
    // this.terms_temp = database.terms;

    database?.cards &&
      Object.keys(database.cards).forEach(
        (card_id) => (this.cards[card_id] = new Card(database.cards[card_id]))
      );
    database?.terms &&
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
    this.termCount = countTerms(deck.cards_sorted);
    if (isBrowser) {
      window.deck = this;
    }
    warnIfSlow.end("Deck");
  }
  continueStudying() {
    updateURL("/vocabulary/play");
    this.session.reset();
    this.session.InitializeSession();
  }
  reset() {
    saveInLocalStorage("vocabulary-user-data", null);
    saveInLocalStorage("vocabulary-session", null);
    this.user_data = {};
    this.schedule = {};
  }
  /* Only used for testing */
  clear() {
    deck = null;
  }
}

export default Deck;
