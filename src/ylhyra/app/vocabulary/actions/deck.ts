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
import { BackendDeck } from "ylhyra/maker/vocabulary_maker/compile/parse_vocabulary_file";

export let deck: Deck | undefined;

export type Schedule = Record<CardId, Partial<ScheduleData>>;
class Deck {
  cards: Record<CardId, any>;
  cards_sorted: CardIds;
  terms: Record<TermId, any>;
  schedule: Schedule;
  user_data: UserData;
  session: Session;
  termCount: number;
  /** Only used in compilation, should be removed */
  alternativeIds: any;

  constructor({
    database,
    schedule,
    session,
    user_data,
  }: {
    database?: BackendDeck;
    schedule?: Schedule;
    session?: Session;
    user_data?: UserData;
  } = {}) {
    deck = this;
    this.cards = database?.cards;
    this.terms = database?.terms;
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
