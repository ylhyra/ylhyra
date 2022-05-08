import { filterCardsThatExist } from "flashcards/flashcards/actions/card/card";
import {
  getDeckId,
  getRowIdFromTermIdOrCardId,
  getTermIdFromCardId,
} from "flashcards/flashcards/compile/ids";
import { getFlashcardsStore } from "flashcards/flashcards/stores/base/flashcardsStore";
import { Row } from "flashcards/flashcards/types/row";
import { CardId, CardIds, TermIds } from "flashcards/flashcards/types/types";
import { getEntireSchedule } from "flashcards/flashcards/stores/userDataStore";

export const getCardsInSchedule = (): CardIds => {
  return filterCardsThatExist(Object.keys(getEntireSchedule()) as CardIds);
};

export const getCardData = <T extends keyof Row>(
  cardId: CardId,
  key: T
): Row[T] => {
  const deckId = getDeckId(cardId);
  const rowId = getRowIdFromTermIdOrCardId(cardId);
  /* Todo: Catch if doesn't exist? */
  return getFlashcardsStore().decks[deckId].rows[rowId][key];
};

/**
 * Deprecated: Each card can now only have one term
 * @deprecated
 */
export const getTermIds = (cardId: CardId): TermIds => {
  return [getTermIdFromCardId(cardId)];
};

export const getLevel = (id: CardId) => {
  throw new Error("Not implemented");
  // return getCardData(id, "level");
};

export const getCardCEFR = getLevel;

// export const getImportance = (cardId: CardId) => {
//   return getCardData(cardId, "importance");
// };
//
// export const getDifficulty = (cardId: CardId) => {
//   return getCardData(cardId, "difficulty");
// };
//
// export const getSound = (cardId: CardId) => {
//   return getCardData(cardId, "sound");
// };

export const getSortKey = (
  cardId: CardId,
  options?: {
    englishLast?: boolean;
  }
): number => {
  throw new Error("Not implemented");
  // if (options?.englishLast) {
  //   return (
  //     getCardData(cardId, "sortKey") + (getDirection(cardId) === "en" ? 0.5 : 0)
  //   );
  // } else {
  //   return getCardData(cardId, "sortKey");
  // }
};
