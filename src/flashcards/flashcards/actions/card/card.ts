import {
  dependencyDepthOfCard,
  getDependenciesAsArrayOfCards,
  hasDependenciesInCommonWith,
} from "flashcards/flashcards/actions/card/cardDependencies";
import {
  isBad,
  isBelowGood,
  isFairlyBad,
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
import {
  getAsCardInSession,
  isInSession,
  wasSeenInSession,
} from "flashcards/flashcards/actions/card/functions";
import { printWord } from "flashcards/flashcards/actions/functions";
import { getDirectionFromCardId } from "flashcards/flashcards/actions/row/ids";
import { Row } from "flashcards/flashcards/actions/row/row";
import { saveCardSchedule } from "flashcards/flashcards/actions/userData/userDataSchedule";
import { CardId, Direction } from "flashcards/flashcards/types";
import { isAllowed } from "flashcards/flashcards/actions/card/cardIsAllowed";

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
   * (Todo: Check if cards.includes(card) works instead)
   */
  isIn(cards: Card[]) {
    return cards.some((card) => card.is(this));
  }

  /**
   * (Todo: May not be necessary as Card === Card also works...)
   */
  is(card: Card) {
    return this.cardId === card.cardId;
  }

  /** Todo */
  getSortKey() {
    return -this.data.rowNumber;
  }

  dependencyDepthOfCard = dependencyDepthOfCard;
  isInSession = isInSession;
  hasDependenciesInCommonWith = hasDependenciesInCommonWith;
  isAllowed = isAllowed;
  wasSeenInSession = wasSeenInSession;
  getDependenciesAsArrayOfCards = getDependenciesAsArrayOfCards;
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
