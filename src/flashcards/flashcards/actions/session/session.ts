import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { SessionHistory } from "flashcards/flashcards/actions/session/sessionHistory";
import { SessionTimer } from "flashcards/flashcards/actions/session/sessionTimer";
import { makeObservable, observable } from "mobx";
import { clearTimeMemoized } from "modules/time";
import { NonEmptyArray } from "modules/typescript/arrays";

export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;
export const EACH_SESSION_LASTS_X_MINUTES = 3;

/**
 * A session is the currently ongoing flashcard game.
 * There can only be one ongoing session at a time.
 */
export class Session {
  cards!: CardInSession[];
  currentCard?: CardInSession;

  /** Limits session to specific decks */
  allowedDecks: Deck[] = [];
  /** Limit session to specific cards. */
  allowedCards: NonEmptyArray<Card> | undefined;

  history!: SessionHistory;
  timer!: SessionTimer;

  /**
   * This counter increases for every new card the user sees.
   * It is used for scheduling cards within the session,
   * e.g. "This card should be shown when the counter is at 8".
   *
   * The counter value for the first card is "1".
   *
   * The user interface relies on this value for refreshing.
   */
  @observable counter: number = 0;
  @observable userFacingError?: string;

  /**
   * Todo: Should be moved to user data store
   */
  @observable isVolumeOn: boolean = true;

  constructor() {
    this.reset();
    makeObservable(this);
  }

  /**
   * We have to reset instead of creating a new session object
   * in order to allow MobX to listen to changes
   * (the interface would otherwise be listening to an older object)
   */
  reset() {
    // this.counter = 0;
    this.allowedDecks = [];
    this.allowedCards = undefined;
    this.currentCard = undefined;
    this.cards = [];
    this.timer = new SessionTimer();
    this.history = new SessionHistory(this);
    this.userFacingError = undefined;
  }

  /**
   * Called by {@link nextCard}
   */
  increaseCounterAndClearCaches() {
    this.counter++;
    clearTimeMemoized();
    this.timer.updateRemainingTime();
  }
}

let store: Session;
export const getSession = (): Session => {
  return store || (store = new Session());
};
