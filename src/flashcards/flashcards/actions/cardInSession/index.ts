import { Card } from "flashcards/flashcards/actions/card/card";
import { CardId, Rating } from "flashcards/flashcards/types/types";
import { Row } from "flashcards/flashcards/actions/row/row";
import { getRanking } from "flashcards/flashcards/actions/cardInSession/getRanking";
import {
  getSession,
  Session,
} from "flashcards/flashcards/actions/session/session";
import { getTermIdFromCardId } from "flashcards/flashcards/actions/deck/compile/ids";
import { postponeRelatedCards } from "flashcards/flashcards/actions/cardInSession/postponeRelatedCards";
import { rate } from "flashcards/flashcards/actions/cardInSession/rate";
import { showIn } from "flashcards/flashcards/actions/cardInSession/showIn";

/**
 * An interval of "1" would mean that that card is shown next.
 */
export type IntervalRelativeToCurrentCardBeingAtZero = number;

export class CardInSession extends Card {
  // cardId: CardId;
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

  constructor({
    row,
    cardId,
    insertAtPosition,
    history,
  }: {
    row: Row;
    cardId: CardId;
    insertAtPosition?: number;
    /** Used for initializing again from a saved state */
    history?: Rating[];
  }) {
    super(row, cardId);
    this.cardId = cardId;
    this.history = history || [];
    this.absoluteQueuePosition =
      (getSession().counter || 0) + (insertAtPosition || 0);
  }

  hasBeenSeenInSession() {
    return this.history.length > 0;
  }

  hasTermBeenSeenInSession() {
    return getSession().termsSeen.has(getTermIdFromCardId(this.cardId));
  }

  getOtherCardsInSession(): CardInSession[] {
    return getSession().cards.filter((card) => card.cardId !== this.cardId);
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
