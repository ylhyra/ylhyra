import { log } from "modules/log";
import { getTime, Milliseconds, minutes, Timestamp } from "modules/time";
import Analytics from "ylhyra/app/app/analytics";
import { EACH_SESSION_LASTS_X_MINUTES } from "ylhyra/app/app/constants";
import { saveInLocalStorage } from "ylhyra/app/app/functions/localStorage";
import { roundMsToSec, roundToInterval } from "ylhyra/app/app/functions/math";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import { doesCardExist } from "ylhyra/app/vocabulary/actions/card/card";
import { CardIds, TermId } from "ylhyra/app/vocabulary/actions/card/types";
import CardInSession from "ylhyra/app/vocabulary/actions/cardInSession";
import { createCards } from "ylhyra/app/vocabulary/actions/createCards";
import { createSchedule } from "ylhyra/app/vocabulary/actions/createSchedule";
import Deck from "ylhyra/app/vocabulary/actions/deck";
import { exitVocabularyScreen } from "ylhyra/app/vocabulary/actions/functions";
import {
  answer,
  checkIfCardsRemaining,
  createMoreCards,
  getPercentageDone,
  updateRemainingTime,
} from "ylhyra/app/vocabulary/actions/session/functions";
import { initializeSession } from "ylhyra/app/vocabulary/actions/session/initialize";
import { loadCardInInterface } from "ylhyra/app/vocabulary/actions/session/loadCardInInterface";
import { loadCardsIntoSession } from "ylhyra/app/vocabulary/actions/session/loadCardsIntoSession";
import { nextCard } from "ylhyra/app/vocabulary/actions/session/nextCard";
import {
  checkForUndoOnKeyDown,
  undo,
  undoable,
} from "ylhyra/app/vocabulary/actions/session/undo";
import { sync } from "ylhyra/app/vocabulary/actions/userData/sync";
import { setUserData } from "ylhyra/app/vocabulary/actions/userData/userData";
import { SESSION_PREFIX } from "ylhyra/app/vocabulary/actions/userData/userDataSessions";
import { rating } from "ylhyra/app/vocabulary/constants";
import { clearOverview } from "ylhyra/app/vocabulary/elements/OverviewScreen/actions";
import { getDeckName } from "ylhyra/maker/vocabulary_maker/compile/functions";

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
