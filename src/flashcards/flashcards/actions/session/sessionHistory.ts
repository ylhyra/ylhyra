import { store } from 'flashcards/store';
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { RowId } from "flashcards/flashcards/actions/row/rowData.types";
import { Session } from "flashcards/flashcards/actions/session/session";
import { Rating, Direction } from "flashcards/flashcards/types";
import { Timestamp } from "modules/time";
import { makeAutoObservable } from "mobx";

export class SessionHistory {
  /** The most recent card is pushed to the front of this array */
  cardHistory: CardInSession[] = [];
  /** The most recent card is pushed to the front of this array */
  cardDirectionLog: Direction[] = [];

  /** Used by {@link getRanking} in order to prioritize seen cards */
  rowsSeen = new Set<RowId>();
  ratingHistory: Rating[] = [];
  savedAt?: Timestamp;

  /** Todo: Rework? */
  #lastUndidAtCounter?: Session["counter"];

  constructor(public session: Session) {
    makeAutoObservable(this);
  }

  add(cardInSession: CardInSession, rating: Rating) {
    this.ratingHistory.unshift(rating);
    this.cardHistory.unshift(cardInSession);
    this.rowsSeen.add(cardInSession.rowId);
    this.cardDirectionLog.unshift(cardInSession.direction);
  }

  undo() {
    const cardInSession = this.cardHistory?.[0];
    if (!cardInSession) return;
    cardInSession.ratingHistory.shift();
    this.session.currentCard = cardInSession;
    this.cardHistory!.shift();
    this.#lastUndidAtCounter = this.session.counter;
    this.session.counter++;
  }

  isUndoable() {
    return (
      this.cardHistory &&
      this.cardHistory.length > 0 &&
      this.#lastUndidAtCounter !== this.session.counter
    );
  }
}

export function checkForUndoOnKeyDown(e: KeyboardEvent) {
  const session = store.session;
  if (
    e.keyCode === 90 &&
    (e.ctrlKey || e.metaKey) &&
    !e.altKey &&
    session.history.isUndoable()
  ) {
    e.preventDefault();
    session.history.undo();
  }
}
