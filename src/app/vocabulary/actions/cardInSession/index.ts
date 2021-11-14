import { postponeRelatedCards } from "app/vocabulary/actions/cardInSession/postponeRelatedCards";
import {
  canBeShown,
  showIn,
} from "app/vocabulary/actions/cardInSession/showIn";
import { rate } from "app/vocabulary/actions/cardInSession/rate";
import { getRanking } from "app/vocabulary/actions/cardInSession/getRanking";
import Session from "app/vocabulary/actions/session";
import { rating } from "app/vocabulary/actions/card/card_difficulty";
import { CardId } from "app/vocabulary/actions/card/types";

class CardInSession {
  id: CardId;
  session: Session;
  history: Array<rating>;
  absoluteQueuePosition: number;
  cannotBeShownBefore?: number;
  done?: boolean;

  constructor({
    id,
    insertAtPosition,
    session,
    history,
  }: {
    id: CardId;
    insertAtPosition?: number;
    session?: Session;
    history?: Array<rating>;
  }) {
    this.id = id;
    this.session = session;
    this.history = history || [];
    this.absoluteQueuePosition =
      (session?.counter || 0) + (insertAtPosition || 0);
  }

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

export default CardInSession;
