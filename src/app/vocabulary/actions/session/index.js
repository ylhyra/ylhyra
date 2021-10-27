import { getTime, minutes } from "app/app/functions/time";
import { log } from "app/app/functions/log";
import { updateURL } from "app/router/actions/updateURL";
import { saveInLocalStorage } from "app/app/functions/localStorage";
import Analytics from "app/app/analytics";
import { SESSION_PREFIX, setUserData, sync } from "app/vocabulary/actions/sync";
import CardInSession from "app/vocabulary/actions/cardInSession";
import { getCardById } from "app/vocabulary/actions/card/functions";
import { extendPrototype } from "app/app/functions/extendPrototype";
import { EACH_SESSION_LASTS_X_MINUTES } from "app/app/constants";

export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;

/**
 * @property {Array.<CardInSession>} cards
 * @property {Deck} deck
 * @property {Array.<number>} ratingHistory
 * @property {Array.<CardInSession>} cardHistory
 * @property {CardInSession|null} currentCard
 * @namespace
 */
class Session {
  constructor(deck, init) {
    this.reset();
    this.deck = deck;
    /* Used to save the progress of a session that was prematurely closed */
    if (init?.cards) {
      Object.assign(this, init);
      this.cards = this.cards.map(({ id, history }) => {
        return new CardInSession({
          data: getCardById(id),
          history,
        });
      });
      this.sessionDone({ isInitializing: true });
    }
    // log({ session_log: this.deck.session_log });
  }
  reset() {
    this.allowed_ids = null;
    this.ratingHistory = [];
    this.cardHistory = [];
    this.counter = 0;
    this.lastSeenTerms = {};
    this.cardTypeLog = [];
    this.currentCard = null;
    this.cards = [];
    this.timeStarted = getTime();
    this.totalTime = EACH_SESSION_LASTS_X_MINUTES * minutes;
    this.remainingTime = this.totalTime;
    this.lastTimestamp = getTime();
    this.done = false;
    this.lastUndid = 0;
    this.savedAt = null;
  }
  async sessionDone(options = {}) {
    this.done = true;
    // console.log({ s: this, done: this.done });
    await this.createSchedule();
    this.clearInLocalStorage();
    if (!options.isInitializing) {
      let url = window.location.pathname;
      if (url === "/vocabulary/play") {
        url = "/vocabulary";
      }
      await updateURL(url);
    }
    await sync();
    /* Analytics */
    if (this.getSecondsSpent() > 10) {
      // TODO: Ignore logged in users?
      Analytics.log({
        type: "vocabulary",
        page_name: window.location.pathname,
        seconds: this.getSecondsSpent(),
      });
    }
    this.reset();
  }
  getSecondsSpent() {
    return Math.round(
      (this.totalTime - Math.max(0, this.remainingTime)) / 1000
    );
  }
  saveSessionInLocalStorage() {
    const session = this;
    if (!session.cards.some((i) => i.hasBeenSeenInSession())) {
      return;
    }
    let to_save = session.cards.map((card) => ({
      id: card.getId(),
      history: card.history,
    }));
    saveInLocalStorage("vocabulary-session", {
      remainingTime: this.remainingTime,
      savedAt: getTime(),
      cards: to_save,
    });
  }
  clearInLocalStorage() {
    saveInLocalStorage("vocabulary-session", null);
  }
  saveSessionLog() {
    if (this.cardHistory.length > 0) {
      const timestamp = this.savedAt || getTime();
      const timestamp_in_seconds = Math.round(timestamp / 1000);
      setUserData(
        SESSION_PREFIX + timestamp_in_seconds,
        {
          seconds_spent: this.getSecondsSpent(),
          timestamp,
        },
        "session"
      );
    } else {
      log("Not logged");
    }
  }
}

extendPrototype(
  Session,
  require("app/vocabulary/actions/session/undo"),
  require("app/vocabulary/actions/session/functions"),
  require("app/vocabulary/actions/createCards"),
  require("app/vocabulary/actions/session/initialize"),
  require("app/vocabulary/actions/session/nextCard"),
  require("app/vocabulary/actions/createSchedule"),
  require("app/vocabulary/actions/session/loadCardsIntoSession"),
  require("app/vocabulary/actions/session/loadCardInInterface")
);

export default Session;
