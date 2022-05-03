import { isBrowser } from "modules/isBrowser";
import { saveInLocalStorage } from "modules/localStorage";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import { sortBySortKey } from "ylhyra/vocabulary/app/actions/createCards/functions";
import { countTerms } from "ylhyra/vocabulary/app/actions/functions";
import Session from "ylhyra/vocabulary/app/actions/session";
import { UserData } from "ylhyra/vocabulary/app/actions/userData/userData";
import {
  CardId,
  CardIds,
  Cards,
  DeckDatabase,
  ScheduleData,
  Terms,
} from "ylhyra/vocabulary/types";

export let deck: Deck | undefined;

export type Schedule = Record<CardId, Partial<ScheduleData>>;
class Deck {
  cards: Cards = {};
  cards_sorted: CardIds = [];
  terms: Terms = {};
  schedule: Schedule = {};
  user_data: UserData | null = null;
  session: Session;
  termCount: number;

  /** Only used in compilation, should be removed */
  alternativeIds: DeckDatabase["alternativeIds"];

  constructor({
    database,
    schedule,
    session,
    user_data,
  }: {
    database?: DeckDatabase;
    schedule?: Schedule;
    session?: Session;
    user_data?: UserData;
  }) {
    deck = this;
    if (database) {
      this.cards = database.cards;
      this.terms = database.terms;
      this.user_data = user_data || null;
      this.schedule = schedule || {};

      this.cards_sorted = sortBySortKey(Object.keys(this.cards) as CardIds, {
        englishLast: true,
      });
    }
    this.termCount = countTerms(deck!.cards_sorted);
    if (isBrowser) {
      // @ts-ignore
      window["deck"] = this;
    }
    this.session = new Session(deck, session);
  }
  continueStudying() {
    goToUrl("/vocabulary/play");
    this.session.reset();
    void this.session.initializeSession();
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
