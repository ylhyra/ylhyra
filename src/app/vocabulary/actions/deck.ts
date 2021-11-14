import { isBrowser } from "app/app/functions/isBrowser";
import { saveInLocalStorage } from "app/app/functions/localStorage";
import { updateURL } from "app/router/actions/updateURL";
import Session from "app/vocabulary/actions/session";
import { countTerms } from "app/vocabulary/actions/functions";
import { warnIfSlow } from "app/app/functions/warnIfSlow";
import { sortBySortKey } from "app/vocabulary/actions/createCards/functions";
import {
  CardId,
  CardIds,
  ScheduleData,
  TermId,
} from "app/vocabulary/actions/card/types";

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
  schedule: Record<CardId, ScheduleData>;
  user_data: any; //UserData;
  session: Session;
  termCount: number;

  constructor({ database, schedule, session, user_data }) {
    deck = this;
    this.cards = database.cards;
    this.terms = database.terms;
    this.user_data = user_data || {};
    this.schedule = schedule || {};
    this.session = new Session(deck, session);

    this.cards_sorted = sortBySortKey(Object.keys(this.cards) as CardIds, {
      englishLast: true,
    });
    this.termCount = countTerms(deck.cards_sorted);
    if (isBrowser) {
      window["deck"] = this;
    }
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
