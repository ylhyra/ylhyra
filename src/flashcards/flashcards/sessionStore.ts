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
  cardHistory: CardInSession[] = [];
  cardTypeLog: Direction[] = [];

  /** Todo: Verify this is being used */
  done: boolean = false;
  lastSeenTerms: Record<TermId, sessionStore["counter"]> = {};
  lastUndidAtCounter?: sessionStore["counter"];
  ratingHistory: Rating[] = [];
  savedAt: Timestamp | null = null;

  /** How long should a session last? */
  totalTime: Milliseconds;
  /** Used to update the progress bar and to see when the time is up */
  remainingTime: Milliseconds;
  /** Used by {@link updateRemainingTime} */
  remainingTimeLastUpdatedAt: Timestamp;

  /**
   * This counter increases for every card the user has seen.
   * It is used for scheduling cards within the session,
   * e.g. "This card should be shown when the counter is at 8".
   */
  counter: number = 0;
  userFacingError: string | null = null;
  isVolumeOn: boolean = true;

  /** Temp */
  allowedDeckIds: DeckId[] = [];

  constructor() {
    makeObservable(this, {
      counter: observable,
      userFacingError: observable,
      isVolumeOn: observable,
    });
    this.totalTime = (EACH_SESSION_LASTS_X_MINUTES * minutes) as Milliseconds;
    this.remainingTime = this.totalTime;
    this.remainingTimeLastUpdatedAt = getTime();
  }
}

let store: sessionStore;
export const getSession = (): sessionStore => {
  return store || (store = new sessionStore());
};

/** Initialize a new session object */
export const resetSession = (): sessionStore => {
  return (store = new sessionStore());
};
