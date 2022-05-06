import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import {
  CardIds,
  DeckId,
  Direction,
  Rating,
  TermId,
} from "flashcards/flashcards/types/types";
import { makeObservable, observable } from "mobx";
import { getTime, Milliseconds, minutes, Timestamp } from "modules/time";

export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;
export const EACH_SESSION_LASTS_X_MINUTES = 3;

/**
 * A session is the currently ongoing flashcard game.
 * There can only be one ongoing session at a time.
 */
export class sessionStore {
  cards: CardInSession[] = [];
  currentCard: CardInSession | null = null;
  allowedIds: CardIds | null = null;

  /** The most recent card is pushed to the front of this array */
  cardHistory: CardInSession[] = [];
  /** The most recent card is pushed to the front of this array */
  cardDirectionLog: Direction[] = [];

  /** Set by {@link sessionDone} so that {@link nextCard} can exit */
  done: boolean = false;

  /** Used by {@link getRanking} in order to prioritize seen cards */
  termsSeen = new Set<TermId>();
  lastUndidAtCounter?: sessionStore["counter"];
  ratingHistory: Rating[] = [];
  savedAt: Timestamp | null = null;

  /** How long should a session last? */
  totalTime?: Milliseconds;
  /** Used to update the progress bar and to see when the time is up */
  remainingTime?: Milliseconds;
  /** Used by {@link getRemainingTime} */
  remainingTimeLastUpdatedAt?: Timestamp;

  /**
   * This counter increases for every card the user has seen.
   * It is used for scheduling cards within the session,
   * e.g. "This card should be shown when the counter is at 8".
   *
   * Note: The counter is increased by {@link nextCard} before
   * a new card is loaded, therefore the counter for the first card
   * is "1".
   */
  counter: number = 0;
  userFacingError: string | null = null;
  isVolumeOn: boolean = true;

  /** Temp */
  allowedDeckIds: DeckId[] = [];

  constructor() {
    this.reset();
    makeObservable(this, {
      counter: observable,
      userFacingError: observable,
      isVolumeOn: observable,
    });
  }

  /**
   * We have to reset instead of creating a new session object
   * in order to allow MobX to listen to changes
   * (the interface would otherwise be listening to an older object)
   */
  reset() {
    this.allowedIds = null;
    this.ratingHistory = [];
    this.cardHistory = [];
    this.counter = 0;
    this.termsSeen = new Set<TermId>();
    this.cardDirectionLog = [];
    this.currentCard = null;
    this.cards = [];
    this.totalTime = (EACH_SESSION_LASTS_X_MINUTES * minutes) as Milliseconds;
    this.remainingTime = this.totalTime;
    this.remainingTimeLastUpdatedAt = getTime();
    this.done = false;
    this.lastUndidAtCounter = 0;
    this.savedAt = null;
    this.allowedDeckIds = [];
    this.userFacingError = null;
  }
}

let store: sessionStore;
export const getSession = (): sessionStore => {
  return store || (store = new sessionStore());
};
