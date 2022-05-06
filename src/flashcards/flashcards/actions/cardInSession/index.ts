import { getRanking } from "flashcards/flashcards/actions/cardInSession/getRanking";
import { postponeRelatedCards } from "flashcards/flashcards/actions/cardInSession/postponeRelatedCards";
import { rate } from "flashcards/flashcards/actions/cardInSession/rate";
import { showIn } from "flashcards/flashcards/actions/cardInSession/showIn";
import { getTermIdFromCardId } from "flashcards/flashcards/compile/ids";
import { getSession, sessionStore } from "flashcards/flashcards/sessionStore";
import { CardId, Rating } from "flashcards/flashcards/types/types";

/**
 * An interval of "1" would mean that that card is shown next.
 */
export type IntervalRelativeToCurrentCardBeingAtZero = number;

export class CardInSession {
  cardId: CardId;
  history: Rating[] = [];

  /** Queue position relative to session counter */
  absoluteQueuePosition: sessionStore["counter"];
  /** Hard limit on when a card can be shown */
  cannotBeShownBefore?: sessionStore["counter"];
  lastSeenAtCounter?: sessionStore["counter"];

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
    cardId,
    insertAtPosition,
    history,
  }: {
    cardId: CardId;
    insertAtPosition?: number;
    /** Used for initializing again from a saved state */
    history?: Rating[];
  }) {
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
