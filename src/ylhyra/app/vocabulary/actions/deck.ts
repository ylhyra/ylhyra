import { isBrowser } from "modules/isBrowser";
import { saveInLocalStorage } from "ylhyra/app/app/functions/localStorage";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import {
  CardId,
  CardIds,
  ScheduleData,
  TermId,
} from "ylhyra/app/vocabulary/actions/card/types";
import { sortBySortKey } from "ylhyra/app/vocabulary/actions/createCards/functions";
import { countTerms } from "ylhyra/app/vocabulary/actions/functions";
import Session from "ylhyra/app/vocabulary/actions/session";
import { UserData } from "ylhyra/app/vocabulary/actions/userData/userData";

export let deck: Deck | undefined;

class Deck {
  cards: Record<CardId, any>;
  cards_sorted: CardIds;
  terms: Record<TermId, any>;
  schedule: Record<CardId, Partial<ScheduleData>>;
  user_data: UserData;
  session: Session;
  termCount: number;
  /** Only used in compilation, should be removed */
  alternative_ids: any;

  constructor({ database, schedule, session, user_data }) {
    deck = this;
    this.cards = database.cards;
    this.terms = database.terms;
    this.user_data = user_data || null;
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
    goToUrl("/vocabulary/play");
    this.session.reset();
    this.session.initializeSession();
  }
  reset() {
    saveInLocalStorage("vocabulary-user-data", null);
    saveInLocalStorage("vocabulary-session", null);
    this.user_data = null;
    this.schedule = {};
  }
  // /* Only used for testing */
  // clear() {
  //   deck = null;
  // }
}

export default Deck;
