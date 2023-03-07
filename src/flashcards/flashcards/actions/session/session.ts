import { makeObservable, observable } from "mobx";
import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { SessionHistory } from "flashcards/flashcards/actions/session/sessionHistory";
import { SessionTimer } from "flashcards/flashcards/actions/session/sessionTimer";
import { NonEmptyArray } from "modules/typescript/arrays";

export const MAX_SECONDS_TO_COUNT_PER_ITEM = 10;
export const EACH_SESSION_LASTS_X_MINUTES = 3;

/**
 * A session is the currently ongoing flashcard game.
 * There can only be one ongoing session at a time.
 */
export class Session {
  cards!: CardInSession[];
  @observable currentCard?: CardInSession;

  /** Limits session to specific deck (required) */
  chosenDeck?: Deck;
  /** Limit session to specific cards (optional) */
  allowedCards?: NonEmptyArray<Card>;

  history!: SessionHistory;
  timer!: SessionTimer;

  /**
   * This counter increases for every new card the user sees.
   * It is used for scheduling cards within the session, e.g.
   * "This card should be shown when the counter is at 8".
   *
   * The counter value for the first card will be "1".
   *
   * The user interface relies on this value for refreshing.
   */
  @observable counter: number = 0;

  /**
   * Reverse list of a description of the cards that were "added" to be shown,
   * i.e. ignoring cards that are being shown again.
   */
  addedCardLog: ("NEW" | "OVERDUE_BAD" | "OVERDUE_GOOD")[] = [];

  /** Todo: Move elsewhere */
  @observable userFacingError?: string;

  // @observable continueEvenIfAllCardsAreSeen: boolean = false;

  constructor() {
    this.reset();
    makeObservable(this);
  }

  /**
   * We have to reset instead of creating a new session object in order to allow
   * MobX to listen to changes (the interface would otherwise be listening to an
   * older object)
   */
  reset() {
    this.chosenDeck = undefined;
    this.allowedCards = undefined;
    this.currentCard = undefined;
    this.cards = [];
    this.timer = new SessionTimer(this);
    this.history = new SessionHistory(this);
    this.userFacingError = undefined;
    this.addedCardLog = [];
  }

  areThereUnseenCardsRemaining() {
    return this.cards.some(
      (i: CardInSession) => !i.hasBeenSeenInSession && !i.done && i.canBeShown,
    );
  }
}
