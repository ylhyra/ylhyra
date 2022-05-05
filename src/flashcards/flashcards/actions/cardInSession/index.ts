import { getRanking } from "flashcards/flashcards/actions/cardInSession/getRanking";
import { postponeRelatedCards } from "flashcards/flashcards/actions/cardInSession/postponeRelatedCards";
import { rate } from "flashcards/flashcards/actions/cardInSession/rate";
import {
  canBeShown,
  showIn,
} from "flashcards/flashcards/actions/cardInSession/showIn";
import { sessionStore } from "flashcards/flashcards/sessionStore";
import { CardId, Rating } from "flashcards/flashcards/types/types";

export class CardInSession {
  id: CardId;
  session: sessionStore;
  history: Array<Rating> = [];
  absoluteQueuePosition: number; /* Counter */
  cannotBeShownBefore?: number; /* Counter */
  lastSeen?: number; /* Counter */
  done?: boolean;

  constructor({
    id,
    insertAtPosition,
    session,
    history,
  }: {
    id: CardId;
    session: sessionStore;
    insertAtPosition?: number;
    history?: Array<Rating>;
  }) {
    this.id = id;
    this.session = session;
    this.history = history || [];
    this.absoluteQueuePosition =
      (session?.counter || 0) + (insertAtPosition || 0);
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

  getOtherCardsInSession(): Array<CardInSession> {
    return this.session.cards.filter((card) => card.getId() !== this.getId());
  }

  getQueuePosition(): number {
    return this.absoluteQueuePosition - this.session.counter;
  }

  setQueuePosition(interval: number) {
    this.absoluteQueuePosition = this.session.counter + interval;
  }

  setCannotBeShownBefore(interval: number) {
    this.cannotBeShownBefore = Math.max(
      this.cannotBeShownBefore || 0,
      this.session.counter + interval
    );
  }

  getRanking = getRanking;
  rate = rate;
  postponeRelatedCards = postponeRelatedCards;
  showIn = showIn;
  canBeShown = canBeShown;
}
