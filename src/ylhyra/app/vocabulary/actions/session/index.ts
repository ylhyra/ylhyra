import {
  getTime,
  Milliseconds,
  minutes,
  Timestamp,
} from "ylhyra/app/app/functions/time";
import { log } from "modules/log";
import { saveInLocalStorage } from "ylhyra/app/app/functions/localStorage";
import Analytics from "ylhyra/app/app/analytics";
import { sync } from "ylhyra/app/vocabulary/actions/userData/sync";
import CardInSession from "ylhyra/app/vocabulary/actions/cardInSession";
import { EACH_SESSION_LASTS_X_MINUTES } from "ylhyra/app/app/constants";
import { clearOverview } from "ylhyra/app/vocabulary/elements/OverviewScreen/actions";
import { roundMsToSec, roundToInterval } from "ylhyra/app/app/functions/math";
import { exitVocabularyScreen } from "ylhyra/app/vocabulary/actions/functions";
import { setUserData } from "ylhyra/app/vocabulary/actions/userData/userData";
import { SESSION_PREFIX } from "ylhyra/app/vocabulary/actions/userData/userDataSessions";
import Deck from "ylhyra/app/vocabulary/actions/deck";
import { doesCardExist } from "ylhyra/app/vocabulary/actions/card/card";
import { createCards } from "ylhyra/app/vocabulary/actions/createCards";
import { InitializeSession } from "ylhyra/app/vocabulary/actions/session/initialize";
import { nextCard } from "ylhyra/app/vocabulary/actions/session/nextCard";
import { createSchedule } from "ylhyra/app/vocabulary/actions/createSchedule";
import { loadCardsIntoSession } from "ylhyra/app/vocabulary/actions/session/loadCardsIntoSession";
import {
  checkForUndoOnKeyDown,
  undo,
  undoable,
} from "ylhyra/app/vocabulary/actions/session/undo";
import {
  answer,
  checkIfCardsRemaining,
  createMoreCards,
  getPercentageDone,
  updateRemainingTime,
} from "ylhyra/app/vocabulary/actions/session/functions";
import { loadCardInInterface } from "ylhyra/app/vocabulary/actions/session/loadCardInInterface";
import { CardIds, TermId } from "ylhyra/app/vocabulary/actions/card/types";
import { rating } from "ylhyra/app/vocabulary/constants";
import { getDeckName } from "ylhyra/maker/vocabulary_maker/compile/functions";
import { updateURL } from "ylhyra/app/router/actions/updateURL";

export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;

type SessionCounter = number;

class Session {
  currentCard: CardInSession;
  cards: Array<CardInSession>;
  deck: Deck;
  ratingHistory: Array<rating>;
  cardHistory: Array<CardInSession>;
  allowed_ids: CardIds;
  counter: SessionCounter;
  cardTypeLog: Array<string>;
  lastSeenTerms: Record<TermId, SessionCounter>;
  timeStarted: Timestamp;
  totalTime: Milliseconds;
  remainingTime: Milliseconds;
  lastTimestamp: Timestamp;
  done: boolean;
  lastUndid: SessionCounter;
  savedAt: Timestamp;

  constructor(deck, init) {
    this.reset();
    this.deck = deck;
    /* Used to save the progress of a session that was prematurely closed */
    if (init?.cards) {
      Object.assign(this, init);
      this.cards = this.cards
        .map(({ id, history }) => {
          if (doesCardExist(id)) {
            return new CardInSession({
              id,
              history,
            });
          } else {
            console.warn("No id " + id);
            return null;
          }
        })
        .filter(Boolean);
      /* TODO:
        Þetta virkar ekki án timeout þar sem Deck.session er ekki búið að initializeras fyrst
       */
      setTimeout(() => {
        this.sessionDone({ isInitializing: true });
      }, 10);
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
    this.totalTime = (EACH_SESSION_LASTS_X_MINUTES * minutes) as Milliseconds;
    this.remainingTime = this.totalTime;
    this.lastTimestamp = getTime();
    this.done = false;
    this.lastUndid = 0;
    this.savedAt = null;
  }
  async sessionDone(options: any = {}) {
    this.done = true;
    await this.createSchedule();
    this.clearInLocalStorage();
    if (!options.isInitializing) {
      await exitVocabularyScreen();
    }
    this.saveSessionLog();
    await sync();
    await clearOverview();
    this.reset();

    if (process.env.NODE_ENV === "development" && getDeckName()) {
      updateURL("/vocabulary/play");
      await this.InitializeSession();
    }
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
    this.savedAt = getTime();
  }
  clearInLocalStorage() {
    saveInLocalStorage("vocabulary-session", null);
  }
  saveSessionLog() {
    if (this.cardHistory.length > 0 && this.getSecondsSpent() > 10) {
      const timestamp = roundMsToSec(this.savedAt || getTime());
      const timestamp_in_seconds = Math.round(timestamp / 1000);
      setUserData(
        SESSION_PREFIX + timestamp_in_seconds,
        {
          seconds_spent: roundToInterval(this.getSecondsSpent(), 10),
          timestamp,
        },
        "session"
      );

      // TODO: Ignore logged in users?
      Analytics.log({
        type: "vocabulary",
        page_name: window.location.pathname,
        seconds: roundToInterval(this.getSecondsSpent(), 10),
        timestamp,
      });
    } else {
      log("Not logged");
    }
  }
  undo = undo;
  undoable = undoable;
  checkForUndoOnKeyDown = checkForUndoOnKeyDown;
  createCards = createCards;
  InitializeSession = InitializeSession;
  nextCard = nextCard;
  createSchedule = createSchedule;
  loadCardsIntoSession = loadCardsIntoSession;
  loadCardInInterface = loadCardInInterface;
  updateRemainingTime = updateRemainingTime;
  getPercentageDone = getPercentageDone;
  checkIfCardsRemaining = checkIfCardsRemaining;
  createMoreCards = createMoreCards;
  answer = answer;
}

export default Session;
