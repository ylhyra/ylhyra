import { getDependenciesAsArrayOfCards } from "flashcards/flashcards/actions/card/cardDependencies";
import {
  isBad,
  isBelowGood,
  isFairlyBad,
} from "flashcards/flashcards/actions/card/cardDifficulty";
import { isAllowed } from "flashcards/flashcards/actions/card/cardIsAllowed";
import {
  getDueAt,
  getLowestAvailableRowScore,
  getRowLastSeen,
  isInSchedule,
  isNewCard,
  isNewRowThatHasNotBeenSeenInSession,
  isOverdue,
  isUnseenRow,
  isUnseenSiblingOfANonGoodCard,
  setSchedule,
  timeSinceRowWasSeen,
  wasRowSeenMoreRecentlyThan,
  wasRowVeryRecentlySeen,
} from "flashcards/flashcards/actions/card/cardSchedule";
import {
  didAnySiblingCardsGetABadRatingInThisSession,
  getSiblingCards,
  getSiblingCardsInSession,
} from "flashcards/flashcards/actions/card/cardSiblings";
import {
  getAsCardInSession,
  isInSession,
  wasSeenInSession,
} from "flashcards/flashcards/actions/card/functions";
import { printWord } from "flashcards/flashcards/actions/functions";
import { getDirectionFromCardId } from "flashcards/flashcards/actions/row/ids";
import { Row } from "flashcards/flashcards/actions/row/row";
import { getUserData } from "flashcards/flashcards/actions/userData/userDataStore";
import {
  CardId,
  Direction,
  ScheduleData,
  Score,
} from "flashcards/flashcards/types";
import { Days, Timestamp } from "modules/time";

export class Card {
  row: Row;
  cardId: CardId;

  constructor(row: Row, cardId: CardId) {
    this.row = row;
    this.cardId = cardId;
  }

  get data() {
    return this.row.data;
  }

  get rowId() {
    return this.row.rowId;
  }

  get deck() {
    return this.row.deck;
  }

  get direction(): Direction {
    return getDirectionFromCardId(this.cardId);
  }

  /**
   * Checks if two cards are the same card.
   * (Used since Card === Card doesn't work if they are the same card just
   * initialized at a different time, although that is currently never possible)
   */
  is(card: Card) {
    return this.cardId === card.cardId;
  }

  /** Checks if this card is in an array of cards */
  isIn(cards: Card[]) {
    return cards.some((card) => card.is(this));
  }

  get schedule(): ScheduleData | undefined {
    return getUserData().data[this.cardId] as any as ScheduleData;
  }

  get dueAt(): Timestamp | undefined {
    return this.schedule?.due;
  }

  /** @see Score */
  get score(): Score | undefined {
    return this.schedule?.score;
  }

  get sessionsSeen(): number {
    return this.schedule?.sessionsSeen || 0;
  }

  get numberOfBadSessions(): number {
    return this.schedule?.numberOfBadSessions || 0;
  }

  get lastIntervalInDays(): Days | undefined {
    return this.schedule?.lastIntervalInDays;
  }

  get lastSeen(): Timestamp | undefined {
    return this.schedule?.lastSeen;
  }

  /** Todo */
  getSortKey() {
    return -this.data.rowNumber;
  }

  isInSession = isInSession;
  isAllowed = isAllowed;
  wasSeenInSession = wasSeenInSession;
  getDependenciesAsArrayOfCards = getDependenciesAsArrayOfCards;
  isBad = isBad;
  isFairlyBad = isFairlyBad;
  isBelowGood = isBelowGood;
  getDueAt = getDueAt;
  isOverdue = isOverdue;
  isUnseenSiblingOfANonGoodCard = isUnseenSiblingOfANonGoodCard;
  isInSchedule = isInSchedule;
  setSchedule = setSchedule;
  isUnseenRow = isUnseenRow;
  getLowestAvailableRowScore = getLowestAvailableRowScore;
  getRowLastSeen = getRowLastSeen;
  timeSinceRowWasSeen = timeSinceRowWasSeen;
  wasRowVeryRecentlySeen = wasRowVeryRecentlySeen;
  wasRowSeenMoreRecentlyThan = wasRowSeenMoreRecentlyThan;
  isNewCard = isNewCard;
  isNewRowThatHasNotBeenSeenInSession = isNewRowThatHasNotBeenSeenInSession;
  getSiblingCards = getSiblingCards;
  getSiblingCardsInSession = getSiblingCardsInSession;
  didAnySiblingCardsGetABadRatingInThisSession =
    didAnySiblingCardsGetABadRatingInThisSession;
  getAsCardInSession = getAsCardInSession;
  printWord = printWord;
}
