import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { RowId } from "flashcards/flashcards/actions/row/rowData.types";
import { Direction, Rating } from "flashcards/flashcards/types";
import { makeObservable, observable } from "mobx";
import { Timestamp } from "modules/time";
import { NonEmptyArray } from "modules/typescript/arrays";
import { SessionTimer } from "flashcards/flashcards/actions/session/_functions/sessionTimer";

export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;
export const EACH_SESSION_LASTS_X_MINUTES = 3;

/**
 * A session is the currently ongoing flashcard game.
 * There can only be one ongoing session at a time.
 */
export class Session {
  cards: CardInSession[] = [];
  currentCard?: CardInSession;

  /** Limits session to specific decks */
  allowedDecks: Deck[] = [];
  /** Limit session to specific cards. */
  allowedCards: NonEmptyArray<Card> | undefined;

  /** The most recent card is pushed to the front of this array */
  cardHistory: CardInSession[] = [];
  /** The most recent card is pushed to the front of this array */
  cardDirectionLog: Direction[] = [];

  /** Set by {@link sessionDone} so that {@link nextCard} can exit */
  done: boolean = false;

  /** Used by {@link getRanking} in order to prioritize seen cards */
  rowsSeen = new Set<RowId>();
  lastUndidAtCounter?: Session["counter"];
  ratingHistory: Rating[] = [];
  savedAt?: Timestamp;

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
    this.ratingHistory = [];
    this.cardHistory = [];
    this.rowsSeen = new Set<RowId>();
    this.cardDirectionLog = [];
    this.currentCard = undefined;
    this.cards = [];
    this.timer = new SessionTimer();
    this.done = false;
    this.lastUndidAtCounter = 0;
    this.savedAt = undefined;
    this.userFacingError = undefined;
  }
}

let store: Session;
export const getSession = (): Session => {
  return store || (store = new Session());
};
