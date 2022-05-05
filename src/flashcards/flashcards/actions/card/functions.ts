import { getTermId } from "flashcards/flashcards/actions/card/cardData";
import { CardId, CardIds, TermIds } from "flashcards/flashcards/types/types";
import { uniq } from "underscore";

export const getTermIdsFromCardIds = (ids: CardIds): TermIds => {
  return uniq(ids.map((id) => getTermId(id)));
};

/**
 * Used for testing
 */
export const getCardIdByText = (text: string): CardId => {
  throw new Error("Not implemented");
  // const id = (getHashForVocabulary(text) + "_is") as CardId;
  // // const id = deck?.cards[(getHashForVocabulary(text) + "_is") as CardId]?.id;
  // if (!(id in deck!.cards))
  //   throw new Error(`No card found with text "${text}", id would be ${id}`);
  // return id;
};
