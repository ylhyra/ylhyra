import { getLevel } from "flashcards/flashcards/actions/card/cardData";
import {
  getDependenciesAsArrayOfCardIds,
  getDependenciesAsCardIdToDepth,
  hasDependenciesInCommonWith,
} from "flashcards/flashcards/actions/card/cardDependencies";
import {
  isBad,
  isBelowGood,
  isFairlyBad,
  isTooEasy,
} from "flashcards/flashcards/actions/card/cardDifficulty";
import {
  getDue,
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
  isUnseenRow,
  isUnseenSiblingOfANonGoodCard,
  setSchedule,
  timeSinceRowWasSeen,
  wasRowSeenMoreRecentlyThan,
  wasRowVeryRecentlySeen,
} from "flashcards/flashcards/actions/card/cardSchedule";
import {
  didAnySiblingCardsGetABadRatingInThisSession,
  getAllCardIdsWithSameRow,
  getSiblingCards,
  getSiblingCardsInSession,
} from "flashcards/flashcards/actions/card/cardSiblings";
import { getAsCardInSession } from "flashcards/flashcards/actions/card/functions";
import { printWord } from "flashcards/flashcards/actions/functions";
import { Row } from "flashcards/flashcards/actions/row/row";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { saveCardSchedule } from "flashcards/flashcards/actions/userData/userDataSchedule";
import { CardId } from "flashcards/flashcards/types";

export class Card {
  row: Row;
  cardId: CardId;

  constructor(row: Row, cardId: CardId) {
    this.row = row;
    this.cardId = cardId;
  }

  isInSession = isInSession;
  hasDependenciesInCommonWith = hasDependenciesInCommonWith;
  isAllowed = isAllowed;
  wasSeenInSession = wasSeenInSession;
  getLevel = getLevel;
  getDependenciesAsCardIdToDepth = getDependenciesAsCardIdToDepth;
  getDependenciesAsArrayOfCardIds = getDependenciesAsArrayOfCardIds;
  isTooEasy = isTooEasy;
  isBad = isBad;
  isFairlyBad = isFairlyBad;
  isBelowGood = isBelowGood;
  getDue = getDue;
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
  getAllCardIdsWithSameRow = getAllCardIdsWithSameRow;
  getSiblingCardsInSession = getSiblingCardsInSession;
  didAnySiblingCardsGetABadRatingInThisSession =
    didAnySiblingCardsGetABadRatingInThisSession;
  getAsCardInSession = getAsCardInSession;
  getScheduleForCard = getScheduleForCard;
  saveCardSchedule = saveCardSchedule;
  printWord = printWord;
}

export function isInSession(this: Card) {
  return getSession().cards.some((i) => i.cardId === this.cardId);
}

/**
 * Whether a card is allowed to be chosen by {@link createCards}
 * to be added to the session.
 */
export function isAllowed(this: Card): boolean {
  /* Ignore cards that are already in the session */
  if (this.isInSession()) return false;

  /* If allowedIds is on, only select allowed cards */
  const { allowedIds } = getSession();
  if (allowedIds && !allowedIds.includes(this.cardId)) return false;

  /* In case we're adding cards to an already ongoing session,
     ignore cards that are similar to a card the user has just seen */
  if (
    getSession()
      .cardHistory.slice(0, 3)
      .some(
        (card) =>
          this.row.rowId === card.row.rowId ||
          this.hasDependenciesInCommonWith(card)
        // || isTextSimilarTo(id, card)
      )
  )
    return false;

  return true;
}

export function wasSeenInSession(this: Card) {
  const cardInSession = getSession().cards.find(
    (card) => card.cardId === this.cardId
  );
  return cardInSession && cardInSession.history.length > 0;
}
