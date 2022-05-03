import { saveInLocalStorage } from "modules/localStorage";
import { log } from "modules/log";
import { roundMsToSec, roundToInterval } from "modules/math";
import { getTime, Milliseconds, minutes, Timestamp } from "modules/time";
import Analytics from "ylhyra/app/app/analytics";
import { EACH_SESSION_LASTS_X_MINUTES } from "ylhyra/app/app/constants";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import { doesCardExist } from "ylhyra/vocabulary/app/actions/card/card";
import CardInSession from "ylhyra/vocabulary/app/actions/cardInSession";
import { createCards } from "ylhyra/vocabulary/app/actions/createCards";
import { createSchedule } from "ylhyra/vocabulary/app/actions/createSchedule";
import Deck from "ylhyra/vocabulary/app/actions/deck";
import { exitVocabularyScreen } from "ylhyra/vocabulary/app/actions/functions";
import {
  answer,
  checkIfCardsRemaining,
  createMoreCards,
  getPercentageDone,
  updateRemainingTime,
} from "ylhyra/vocabulary/app/actions/session/functions";
import { initializeSession } from "ylhyra/vocabulary/app/actions/session/initialize";
import { loadCardInInterface } from "ylhyra/vocabulary/app/actions/session/loadCardInInterface";
import { loadCardsIntoSession } from "ylhyra/vocabulary/app/actions/session/loadCardsIntoSession";
import { nextCard } from "ylhyra/vocabulary/app/actions/session/nextCard";
import {
  checkForUndoOnKeyDown,
  undo,
  undoable,
} from "ylhyra/vocabulary/app/actions/session/undo";
import { sync } from "ylhyra/vocabulary/app/actions/userData/sync";
import { setUserData } from "ylhyra/vocabulary/app/actions/userData/userData";
import { SESSION_PREFIX } from "ylhyra/vocabulary/app/actions/userData/userDataSessions";
import { rating } from "ylhyra/vocabulary/app/constants";
import { clearOverview } from "ylhyra/vocabulary/app/elements/OverviewScreen/actions";
import { getDeckName } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { CardIds, TermId } from "ylhyra/vocabulary/types";

export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;

type SessionCounter = number;

class Session {
  allowed_ids: CardIds | null = null;
  cardHistory: Array<CardInSession> = [];
  cardTypeLog: Array<string> = [];
  cards?: Array<CardInSession>;
  counter: SessionCounter = 0;
  currentCard: CardInSession | null = null;
  deck: Deck;
  done?: boolean;
  lastSeenTerms: Record<TermId, SessionCounter> = {};
  lastTimestamp?: Timestamp;
  lastUndid?: SessionCounter;
  ratingHistory: Array<rating> = [];
  remainingTime?: Milliseconds;
  savedAt: Timestamp | null = null;
  timeStarted?: Timestamp;
  totalTime?: Milliseconds;
  undo = undo;
  undoable = undoable;
  checkForUndoOnKeyDown = checkForUndoOnKeyDown;
  createCards = createCards;
  initializeSession = initializeSession;
  nextCard = nextCard;
  createSchedule = createSchedule;
  loadCardsIntoSession = loadCardsIntoSession;
  loadCardInInterface = loadCardInInterface;
  updateRemainingTime = updateRemainingTime;
  getPercentageDone = getPercentageDone;
  checkIfCardsRemaining = checkIfCardsRemaining;
  createMoreCards = createMoreCards;
  answer = answer;

  constructor(deck: Deck, init) {
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
              session: this,
            });
          } else {
            console.warn("No id " + id);
            return null;
          }
        })
        .filter(Boolean);
      /**
       * TODO:
       * Þetta virkar ekki án timeout þar sem Deck.session er ekki búið að initializeras fyrst
       */
      setTimeout(() => {
        void this.sessionDone({ isInitializing: true });
      }, 10);
    }
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
    this.createSchedule();
    this.clearInLocalStorage();
    if (!options.isInitializing) {
      await exitVocabularyScreen();
    }
    this.saveSessionLog();
    await sync();
    clearOverview();
    this.reset();

    if (process.env.NODE_ENV === "development" && getDeckName()) {
      goToUrl("/vocabulary/play");
      await this.initializeSession();
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
    let toSave = session.cards.map((card) => ({
      id: card.getId(),
      history: card.history,
    }));
    saveInLocalStorage("vocabulary-session", {
      remainingTime: this.remainingTime,
      savedAt: getTime(),
      cards: toSave,
    });
    this.savedAt = getTime();
  }

  clearInLocalStorage() {
    saveInLocalStorage("vocabulary-session", null);
  }

  saveSessionLog() {
    if (this.cardHistory.length > 0 && this.getSecondsSpent() > 10) {
      const timestamp = roundMsToSec(this.savedAt || getTime());
      const timestampInSeconds = Math.round(timestamp / 1000);
      setUserData(
        SESSION_PREFIX + timestampInSeconds.toString(),
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
}

export default Session;
