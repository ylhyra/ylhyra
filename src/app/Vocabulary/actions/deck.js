/**
 * The deck contains *all* terms
 */
import store from "app/App/store";
import error from "app/App/Error";
import axios from "app/App/axios";
import { createSchedule } from "./createSchedule";
import Session from "app/Vocabulary/actions/session";
import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/App/functions/localStorage";
import { syncSchedule } from "./sync";
import { spreadOutSchedule } from "./createSchedule";
import { updateURL } from "app/Router/actions";
import { BAD, GOOD, EASY } from "./card";
import _ from "underscore";

class Deck {
  constructor(database, schedule, session) {
    const deck = this;
    const { cards, terms, alternative_ids, dependencies } = database;
    this.cards = cards;
    this.terms = terms;
    this.alternative_ids = alternative_ids;
    this.dependencies = dependencies;
    this.cards_sorted = _.shuffle(Object.keys(cards))
      .map((key) => {
        // if(typeof cards[key] === 'function') return null;
        return cards[key];
      })
      .sort(
        (a, b) =>
          //.test(b.is_plaintext) - //.test(a.is_plaintext) ||
          a.level - b.level ||
          b.hasOwnProperty("sortKey") - a.hasOwnProperty("sortKey") ||
          a.sortKey - b.sortKey ||
          Boolean(b.sound) - Boolean(a.sound)
      )
      .filter(Boolean);
    this.schedule = schedule || {};
    this.session = new Session(deck);
    this.loadSessionFromLocalStorage();
  }
  sessionDone() {
    createSchedule();
    this.saveSession(null, true);
    updateURL(window.location.pathname);
    store.dispatch({
      type: "LOAD_SESSION",
      content: null,
    });
    this.session.reset();
  }
  continueStudying() {
    updateURL("VOCABULARY_PLAY");
    this.session.reset();
    this.session.InitializeSession();
  }
  saveSession(session, done) {
    // if (!done) {
    //   let to_save = session.cards.map(({ session, ...rest }) => rest);
    //   if (!to_save.some((i) => i.history.length > 0)) {
    //     to_save = null;
    //   }
    //   saveInLocalStorage("vocabulary-session", to_save);
    //   saveInLocalStorage("vocabulary-session-saved-at", new Date().getTime());
    // } else {
    //   saveInLocalStorage("vocabulary-session", null);
    // }
  }
  loadSessionFromLocalStorage() {
    // /* TODO: Clear after a day */
    // if (getFromLocalStorage("vocabulary-session")) {
    //   this.session.InitializeSession(
    //     getFromLocalStorage("vocabulary-session"),
    //     this
    //   );
    // }
  }
}
Deck.prototype.syncSchedule = syncSchedule;
Deck.prototype.spreadOutSchedule = spreadOutSchedule;
export default Deck;
