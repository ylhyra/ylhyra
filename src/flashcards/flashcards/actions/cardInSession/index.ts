import { getRanking } from "flashcards/flashcards/actions/cardInSession/getRanking";
import { postponeRelatedCards } from "flashcards/flashcards/actions/cardInSession/postponeRelatedCards";
import { rate } from "flashcards/flashcards/actions/cardInSession/rate";
import {
  canBeShown,
  showIn,
} from "flashcards/flashcards/actions/cardInSession/showIn";
import { getTermIdFromCardId } from "flashcards/flashcards/compile/ids";
import { getSession, sessionStore } from "flashcards/flashcards/sessionStore";
import { CardId, Rating } from "flashcards/flashcards/types/types";

export class CardInSession {
  cardId: CardId;
  history: Rating[] = [];

  /* Queue position relative to session counter */
  absoluteQueuePosition: sessionStore["counter"];
  cannotBeShownBefore?: sessionStore["counter"];
  lastSeen?: sessionStore["counter"];
  done?: boolean;

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
  getQueuePosition(): number {
    return this.absoluteQueuePosition - getSession().counter;
  }

  setQueuePosition(interval: number) {
    this.absoluteQueuePosition = getSession().counter + interval;
  }

  isOverdue() {
    return this.getQueuePosition() < 0;
  }

  isDueExactlyNow() {
    return this.getQueuePosition() === 0;
  }

  setCannotBeShownBefore(interval: number) {
    this.cannotBeShownBefore = Math.max(
      this.cannotBeShownBefore || 0,
      getSession().counter + interval
    );
  }

  getRanking = getRanking;
  rate = rate;
  postponeRelatedCards = postponeRelatedCards;
  showIn = showIn;
  canBeShown = canBeShown;
}
