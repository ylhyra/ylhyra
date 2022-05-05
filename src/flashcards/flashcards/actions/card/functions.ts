import { CardId, CardIds, TermIds } from "flashcards/flashcards/types/types";
import { uniq } from "underscore";
import { getTermIdFromCardId } from "flashcards/flashcards/compile/ids";

export const getTermIdsFromCardIds = (ids: CardIds): TermIds => {
  return uniq(ids.map((id) => getTermIdFromCardId(id)));
};

/**
 * Used for testing
 */
export const getCardIdByText = (text: string): CardId => {
  throw new Error("Not implemented");
  // const id = (getHashForVocabulary(text) + "_is") as CardId;
  // // const id = getCardsFromAllDecks()[(getHashForVocabulary(text) + "_is") as CardId]?.id;
  // if (!(id in getCardsFromAllDecks()))
  //   throw new Error(`No card found with text "${text}", id would be ${id}`);
  // return id;
};
