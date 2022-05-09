import { Card } from "flashcards/flashcards/actions/card/card";
import { CardId, CardIds, TermIds } from "flashcards/flashcards/types/types";
import { RowData } from "flashcards/flashcards/types/rowData";
import { filterCardsThatExist } from "flashcards/flashcards/actions/card/functions";
import {
  getDeckId,
  getRowId,
  getTermIdFromCardId,
} from "flashcards/flashcards/actions/deck/compile/ids";
import { getEntireSchedule } from "flashcards/flashcards/actions/userData/userDataStore";
import { getFlashcardsStore } from "flashcards/flashcards/actions/baseFlashcardsStore/flashcardsStore";

export const getCardsInSchedule = (): CardIds => {
  return filterCardsThatExist(Object.keys(getEntireSchedule()) as CardIds);
};

export const getCardData = <T extends keyof RowData>(
  cardId: CardId,
  key: T
): RowData[T] => {
  const deckId = getDeckId(cardId);
  const rowId = getRowId(cardId);
  /* Todo: Catch if doesn't exist? */
  return getFlashcardsStore().decks[deckId].rows[rowId].data[key];
};

/**
 * Deprecated: Each card can now only have one term
 * @deprecated
 */
export function getTermIds(this: Card): TermIds {
  return [getTermIdFromCardId(cardId)];
}

export function getLevel(this: Card) {
  throw new Error("Not implemented");
  // return getCardData(id, "level");
}

export const getCardCEFR = getLevel;

// export function getImportance(this: Card) {
//   return getCardData(cardId, "importance");
// };
//
// export function getDifficulty(this: Card) {
//   return getCardData(cardId, "difficulty");
// };
//
// export function getSound(this: Card) {
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
