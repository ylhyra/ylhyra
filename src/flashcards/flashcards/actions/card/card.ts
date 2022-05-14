import { printWord } from "flashcards/flashcards/actions/_functions";
import { getAsCardInSession } from "flashcards/flashcards/actions/card/_functions";
import { getLevel } from "flashcards/flashcards/actions/card/cardData";
import {
  dependencyDepthOfCard,
  getDependenciesAsArrayOfCards,
  hasDependenciesInCommonWith,
} from "flashcards/flashcards/actions/card/cardDependencies";
import {
  isBad,
  isBelowGood,
  isFairlyBad,
  isTooEasy,
} from "flashcards/flashcards/actions/card/cardDifficulty";
import {
  getDueAt,
  getLastIntervalInDays,
  getLastSeen,
  getLowestAvailableRowScore,
  getNumberOfBadSessions,
  getRowLastSeen,
  getScheduleForCard,
  getScore,
  getSessionsSeen,
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
import { getDirectionFromCardId } from "flashcards/flashcards/actions/row/ids";
import { Row } from "flashcards/flashcards/actions/row/row";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { saveCardSchedule } from "flashcards/flashcards/actions/userData/userDataSchedule";
import { CardId, Direction } from "flashcards/flashcards/types";

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

  isIn(cards: Card[]) {
    return cards.some((card) => card.is(this));
  }

  is(card: Card) {
    return this.cardId === card.cardId;
  }

  /** @deprecated */
  getSortKey() {
    console.warn("getSortKey is deprecated. Use getCardData instead.");
    throw new Error("Not implemented");
  }

  dependencyDepthOfCard = dependencyDepthOfCard;
  isInSession = isInSession;
  hasDependenciesInCommonWith = hasDependenciesInCommonWith;
  isAllowed = isAllowed;
  wasSeenInSession = wasSeenInSession;
  getLevel = getLevel;
  getDependenciesAsArrayOfCards = getDependenciesAsArrayOfCards;
  isTooEasy = isTooEasy;
  isBad = isBad;
  isFairlyBad = isFairlyBad;
  isBelowGood = isBelowGood;
  getDueAt = getDueAt;
  isOverdue = isOverdue;
  getScore = getScore;
  getSessionsSeen = getSessionsSeen;
  getNumberOfBadSessions = getNumberOfBadSessions;
  getLastIntervalInDays = getLastIntervalInDays;
  getLastSeen = getLastSeen;
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
  getScheduleForCard = getScheduleForCard;
  saveCardSchedule = saveCardSchedule;
  printWord = printWord;
}

export function isInSession(this: Card) {
  return this.isIn(getSession().cards);
}

/**
 * Whether a card is allowed to be chosen by {@link createCards}
 * to be added to the session.
 */
export function isAllowed(this: Card): boolean {
  /* Ignore cards that are already in the session */
  if (this.isInSession()) return false;

  /* If allowedCards is on, only select allowed cards */
  const { allowedCards } = getSession();
  if (allowedCards && this.isIn(allowedCards)) {
    return false;
  }

  /**
   * In case we're adding cards to an already ongoing session,
   * ignore cards that are similar to a card the user has just seen.
   *
   * TODO!! This should not prevent these cards from being chosen,
   * just give them a lower score!
   */
  if (
    getSession()
      .cardHistory.slice(0, 3)
      .some(
        (card) =>
          this.rowId === card.rowId || this.hasDependenciesInCommonWith(card)
        // || isTextSimilarTo(id, card)
      )
  ) {
    return false;
  }

  return true;
}

export function wasSeenInSession(this: Card) {
  const cardInSession = this.getAsCardInSession();
  return cardInSession && cardInSession.history.length > 0;
}

export const getCardById = (id: CardId): Card => {
  throw new Error("Not implemented");
};
