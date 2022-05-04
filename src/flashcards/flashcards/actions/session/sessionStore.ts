import CardInSession from "flashcards/flashcards/actions/cardInSession";
import {
  Direction,
  Rating,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";
import { getTime, Milliseconds, minutes, Timestamp } from "modules/time";
import { entries } from "modules/typescript/objectEntries";

export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;
export const EACH_SESSION_LASTS_X_MINUTES = 3;

/**
 * A counter that increases with each card seen
 */
type SessionCounter = number;

export class sessionStore {
  allowedIds: CardIds | null = null;
  cardHistory: Array<CardInSession> = [];
  cardTypeLog: Array<Direction> = [];
  cards: Array<CardInSession> = [];
  counter: SessionCounter = 0;
  currentCard: CardInSession | null = null;
  done?: boolean;
  lastSeenTerms: Record<TermId, SessionCounter> = {};
  lastTimestamp?: Timestamp;
  lastUndid?: SessionCounter;
  ratingHistory: Array<Rating> = [];
  remainingTime?: Milliseconds;
  savedAt: Timestamp | null = null;
  timeStarted?: Timestamp;
  totalTime?: Milliseconds;

  /** Temp: Todo: find better title */
  allowedDecks: UnprocessedDeck[] = [];
  getCardIdsFromAllowedDecks = (): CardIds => {
    let out: CardIds = [];
    this.allowedDecks.forEach((deck) => {
      entries(deck.cards).forEach(([cardId]) => {
        out.push(cardId as CardId);
      });
    });
    return out;
  };

  constructor() {
    makeAutoObservable(this);
  }

  reset() {
    this.allowedIds = null;
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
    this.allowedDecks = [];
  }
}

/**
 * Trying out whether global stores are better than context stores
 */
const store = new sessionStore();
export const getSession = (): sessionStore => store;
