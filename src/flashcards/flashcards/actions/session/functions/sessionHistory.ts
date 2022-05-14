import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { RowId } from "flashcards/flashcards/actions/row/rowData.types";
import { Session } from "flashcards/flashcards/actions/session/session";
import { Direction, Rating } from "flashcards/flashcards/types";
import { Timestamp } from "modules/time";

export class SessionHistory {
  /** The most recent card is pushed to the front of this array */
  cardHistory: CardInSession[] = [];
  /** The most recent card is pushed to the front of this array */
  cardDirectionLog: Direction[] = [];

  /** Used by {@link getRanking} in order to prioritize seen cards */
  rowsSeen = new Set<RowId>();
  lastUndidAtCounter?: Session["counter"];
  ratingHistory: Rating[] = [];
  savedAt?: Timestamp;
}
