import { isBrowser } from "modules/isBrowser";
import { saveInLocalStorage } from "ylhyra/app/app/functions/localStorage";
import { updateURL } from "ylhyra/app/router/actions/updateURL";
import {
  CardId,
  CardIds,
  ScheduleData,
  TermId,
} from "ylhyra/app/vocabulary/actions/card/types";
import { sortBySortKey } from "ylhyra/app/vocabulary/actions/createCards/functions";
import { countTerms } from "ylhyra/app/vocabulary/actions/functions";
import Session from "ylhyra/app/vocabulary/actions/session";

export let deck: Deck | undefined;

// /**
//  * @property {Object.<string, Card>} cards
//  * @property {Array.<Card>} cards_sorted
//  * @property {Object.<string, Term>} terms
//  * @property {Object.<string, ScheduleData>} schedule
//  * @property {UserData} user_data
//  * @property {Session} session
//  */
class Deck {
  cards: Record<CardId, any>;
  cards_sorted: CardIds;
  terms: Record<TermId, any>;
  schedule: Record<CardId, Partial<ScheduleData>>;
  user_data: any; //UserData;
  session: Session;
  termCount: number;

  constructor({ database, schedule, session, user_data }) {
    deck = this;
    this.cards = database.cards;
    this.terms = database.terms;
    this.user_data = user_data || {};
    this.schedule = schedule || {};

    this.cards_sorted = sortBySortKey(Object.keys(this.cards) as CardIds, {
      englishLast: true,
    });
    this.termCount = countTerms(deck.cards_sorted);
    if (isBrowser) {
      window["deck"] = this;
    }
    this.session = new Session(deck, session);
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
