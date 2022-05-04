import { sortBySortKey } from "flashcards/flashcards/actions/createCards/functions";
import { countTerms } from "flashcards/flashcards/actions/functions";
import Session from "flashcards/flashcards/actions/session";
import { UserData } from "flashcards/flashcards/actions/userData/userData";
import { isBrowser } from "modules/isBrowser";
import { saveInLocalStorage } from "modules/localStorage";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import {
  CardId,
  CardIds,
  Cards,
  DeckDatabase,
  ScheduleData,
  Terms,
} from "ylhyra/vocabulary/types";

class Deck {
  cards: Cards = {};
  cards_sorted: CardIds = [];
  terms: Terms = {};
  schedule: Schedule = {};
  userData: UserData | null = null;
  session: Session;

  constructor({
    database,
    schedule,
    session,
    userData,
  }: {
    database?: DeckDatabase;
    schedule?: Schedule;
    session?: Session;
    userData?: UserData;
  }) {
    deck = this;
    if (database) {
      this.cards = database.cards;
      this.terms = database.terms;
      this.userData = userData || null;
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
    this.userData = null;
    this.schedule = {};
  }
  // /* Only used for testing */
  // clear() {
  //   deck = null;
  // }
}

export default Deck;
