/**
 * The deck contains *all* terms
 */
import store from "app/App/store";
import error from "app/App/Error";
import axios from "app/App/axios";
import { createSchedule } from "./createSchedule";
import Session from "app/Vocabulary/actions/session";

import { syncSchedule } from "./sync";
import { spreadOutSchedule } from "./createSchedule";
import { updateURL } from "app/Router/actions";
import { BAD, GOOD, EASY } from "./card";
import _ from "underscore";

class Deck {
  constructor(database, schedule, session) {
    const deck = this;
    /* For testing */
    window.deck = deck;
    const { cards, terms, alternative_ids, dependencies } = database;
    this.cards = cards;
    this.terms = terms;
    this.alternative_ids = alternative_ids;
    this.dependencies = dependencies;
    const c =
      process.env.NODE_ENV === "development"
        ? Object.keys(cards)
        : _.shuffle(Object.keys(cards));
    this.cards_sorted = c
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
Deck.prototype.spreadOutSchedule = spreadOutSchedule;
export default Deck;
