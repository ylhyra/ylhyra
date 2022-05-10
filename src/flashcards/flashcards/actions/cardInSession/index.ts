import { Card } from "flashcards/flashcards/actions/card/card";
import { getRanking } from "flashcards/flashcards/actions/cardInSession/getRanking";
import { postponeRelatedCards } from "flashcards/flashcards/actions/cardInSession/postponeRelatedCards";
import { rate } from "flashcards/flashcards/actions/cardInSession/rate";
import { showIn } from "flashcards/flashcards/actions/cardInSession/showIn";
import {
  getSession,
  Session,
} from "flashcards/flashcards/actions/session/session";
import { Rating } from "flashcards/flashcards/types";

/**
 * An interval of "1" would mean that that card is shown next.
 */
export type IntervalRelativeToCurrentCardBeingAtZero = number;

export class CardInSession extends Card {
  history: Rating[] = [];

  /**
   * Queue position in relation to the session's counter
   * (e.g. "This card should be shown when the counter is at 8")
   * {@link CardInSession.getQueuePosition} is however relative to the current cart
   */
  absoluteQueuePosition: Session["counter"];
  /** Hard limit on when a card can be shown */
  cannotBeShownBefore?: Session["counter"];
  lastSeenAtCounter?: Session["counter"];

  /**
   * A card is done if the user has said he knows it well.
   * Set by {@link rate}.
   */
  done?: boolean;
  getRanking = getRanking;
  rate = rate;
  postponeRelatedCards = postponeRelatedCards;
  showIn = showIn;

  constructor(
    card: Card,
    {
      insertAtPosition,
      history,
    }: {
      insertAtPosition?: number;
      /** Used for initializing again from a saved state */
      history?: Rating[];
    }
  ) {
    super(card.row, card.cardId);
    this.history = history || [];
    this.absoluteQueuePosition =
      (getSession().counter || 0) + (insertAtPosition || 0);
  }

  hasBeenSeenInSession() {
    return this.history.length > 0;
  }

  hasRowBeenSeenInSession() {
    return getSession().rowsSeen.has(this.rowId);
  }

  getOtherCardsInSession(): CardInSession[] {
    return getSession().cards.filter((card) => !card.is(this));
  }

  /**
   * A card is overdue if its queue position is less than 0.
   * Note: Multiple cards can have the same queue position
   */
  getQueuePosition(): IntervalRelativeToCurrentCardBeingAtZero {
    return this.absoluteQueuePosition - getSession().counter;
  }

  setQueuePosition(interval: IntervalRelativeToCurrentCardBeingAtZero) {
    this.absoluteQueuePosition = getSession().counter + interval;
  }

  setCannotBeShownBefore(interval: IntervalRelativeToCurrentCardBeingAtZero) {
    this.cannotBeShownBefore = Math.max(
      this.cannotBeShownBefore || 0,
      getSession().counter + interval
    );
  }

  canBeShown(): boolean {
    return (
      !this.cannotBeShownBefore ||
      this.cannotBeShownBefore <= getSession().counter
    );
  }

  /**
   * Whether the card is overdue to be shown in this session
   * (note: not the same as being overdue in the schedule)
   */
  isOverdueInCurrentSession() {
    return this.getQueuePosition() < 0;
  }

  isDueExactlyNow() {
    return this.getQueuePosition() === 0;
  }
}
