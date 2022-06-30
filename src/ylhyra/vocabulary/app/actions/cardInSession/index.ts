// @ts-nocheck
import { getRanking } from "ylhyra/vocabulary/app/actions/cardInSession/getRanking";
import { postponeRelatedCards } from "ylhyra/vocabulary/app/actions/cardInSession/postponeRelatedCards";
import { rate } from "ylhyra/vocabulary/app/actions/cardInSession/rate";
import {
  canBeShown,
  showIn,
} from "ylhyra/vocabulary/app/actions/cardInSession/showIn";
import Session from "ylhyra/vocabulary/app/actions/session";
import { rating } from "ylhyra/vocabulary/app/constants";
import { CardId } from "ylhyra/vocabulary/types";

class CardInSession {
  id: CardId;
  session: Session;
  history: Array<rating>;
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
    session: Session;
    insertAtPosition?: number;
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
