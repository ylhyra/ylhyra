import { Card } from "flashcards/flashcards/actions/card/card";
import { getRanking } from "flashcards/flashcards/actions/cardInSession/getRanking";
import { postponeRelatedCards } from "flashcards/flashcards/actions/cardInSession/postponeRelatedCards";
import { rate } from "flashcards/flashcards/actions/cardInSession/rate";
import { showIn } from "flashcards/flashcards/actions/cardInSession/showIn";
import { Session } from "flashcards/flashcards/actions/session/session";
import { Rating } from "flashcards/flashcards/types";

/** An interval of "1" would mean that that card is shown next. */
export type IntervalRelativeToCurrentCardBeingAtZero = number;

export class CardInSession extends Card {
  /**
   * Rating history for the current session. New ratings are added to the START
   * of this array.
   */
  ratingHistory: Rating[] = [];

  /**
   * A card is done if the user has said he knows it well. Set by {@link rate}.
   */
  done?: boolean;

  /**
   * Internally stores info such as "This card should be shown when the counter
   * is at 8"
   */
  #queuePositionRelativeToCounter: Session["counter"];

  /** Hard limit on when a card can be shown */
  #cannotBeShownUntilRelativeToCounter?: Session["counter"];

  constructor(
    card: Card,
    public session: Session,
    {
      insertAtPosition,
      history,
    }: {
      insertAtPosition?: number;
      /** Used for initializing again from a saved state */
      history?: Rating[];
    },
  ) {
    super(card.row, card.cardId);
    this.session = session;
    this.ratingHistory = history || [];
    this.#queuePositionRelativeToCounter =
      (session.counter || 0) + (insertAtPosition || 0);
  }

  get lastRating() {
    return this.ratingHistory[0];
  }

  get nextLastRating() {
    return this.ratingHistory[1];
  }

  get hasBeenSeenInSession() {
    return this.ratingHistory.length > 0;
  }

  hasRowBeenSeenInSession() {
    return this.session.history.rowsSeen.has(this.rowId);
  }

  get thisAndSiblingCardsInSession(): CardInSession[] {
    return this.session.cards.filter((card) => card.rowId === this.rowId);
  }

  getOtherCardsInSession(): CardInSession[] {
    return this.session.cards.filter((card) => !card.is(this));
  }

  /**
   * A card is overdue to be shown again in this session if its queue position
   * is less than 0. Note that multiple cards can have the same queue position
   */
  get queuePosition(): IntervalRelativeToCurrentCardBeingAtZero {
    return this.#queuePositionRelativeToCounter - this.session.counter;
  }

  set queuePosition(interval: IntervalRelativeToCurrentCardBeingAtZero) {
    this.#queuePositionRelativeToCounter = this.session.counter + interval;
  }

  isDueExactlyNow() {
    return this.queuePosition === 0;
  }

  get cannotBeShownUntil(): IntervalRelativeToCurrentCardBeingAtZero {
    return (
      (this.#cannotBeShownUntilRelativeToCounter || 0) - this.session.counter
    );
  }

  set cannotBeShownUntil(interval: IntervalRelativeToCurrentCardBeingAtZero) {
    this.#cannotBeShownUntilRelativeToCounter = Math.max(
      this.#cannotBeShownUntilRelativeToCounter || 0,
      this.session.counter + interval,
    );
  }

  get canBeShown(): boolean {
    return this.cannotBeShownUntil <= 0;
  }

  getRanking = getRanking;
  rate = rate;
  postponeRelatedCards = postponeRelatedCards;
  showIn = showIn;
}
