import { getTermIds } from "flashcards/flashcards/actions/card/cardData";
import { getCardIdsFromTermId } from "flashcards/flashcards/actions/card/term";
import { flatten, uniq } from "underscore";
import { getHashForVocabulary } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";

export const getCardIdsFromTermIds = (termIds: TermIds) => {
  return uniq(
    flatten(termIds.map((t) => getCardIdsFromTermId(t)).filter(Boolean))
  );
};

export const getTermIdsFromCardIds = (ids: CardIds): TermIds => {
  return uniq(flatten(ids.map((id) => getTermIds(id))));
};

/**
 * Used for testing
 */
export const getCardIdByText = (text: string): CardId => {
  const id = (getHashForVocabulary(text) + "_is") as CardId;
  // const id = deck?.cards[(getHashForVocabulary(text) + "_is") as CardId]?.id;
  if (!(id in deck!.cards))
    throw new Error(`No card found with text "${text}", id would be ${id}`);
  return id;
};
