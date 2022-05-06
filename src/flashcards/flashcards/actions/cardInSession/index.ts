import { getRanking } from "flashcards/flashcards/actions/cardInSession/getRanking";
import { postponeRelatedCards } from "flashcards/flashcards/actions/cardInSession/postponeRelatedCards";
import { rate } from "flashcards/flashcards/actions/cardInSession/rate";
import {
  canBeShown,
  showIn,
} from "flashcards/flashcards/actions/cardInSession/showIn";
import { getSession } from "flashcards/flashcards/sessionStore";
import { CardId, Rating } from "flashcards/flashcards/types/types";

export class CardInSession {
  id: CardId;
  history: Rating[] = [];
  absoluteQueuePosition: number; /* Counter */
  cannotBeShownBefore?: number; /* Counter */
  lastSeen?: number; /* Counter */
  done?: boolean;

  constructor({
    id,
    insertAtPosition,
    history,
  }: {
    id: CardId;
    insertAtPosition?: number;
    history?: Rating[];
  }) {
    this.id = id;
    this.history = history || [];
    this.absoluteQueuePosition =
      (getSession().counter || 0) + (insertAtPosition || 0);
  }

  /**
   * @deprecated
   */
  getId() {
    return this.id;
  }

  hasBeenSeenInSession() {
    return this.history.length > 0;
  }

  getOtherCardsInSession(): CardInSession[] {
    return getSession().cards.filter((card) => card.id !== this.id);
  }

  getQueuePosition(): number {
    return this.absoluteQueuePosition - getSession().counter;
  }

  setQueuePosition(interval: number) {
    this.absoluteQueuePosition = getSession().counter + interval;
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
