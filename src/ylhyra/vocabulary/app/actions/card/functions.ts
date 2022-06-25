import { flatten, uniq } from "underscore";
import { getTermIds } from "ylhyra/vocabulary/app/actions/card/card_data";
import { getCardIdsFromTermId } from "ylhyra/vocabulary/app/actions/card/term";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { getHashForVocabulary } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { CardId, CardIds, TermIds } from "ylhyra/vocabulary/types";

export function getCardIdsFromTermIds(termIds: TermIds) {
  return uniq(
    flatten(termIds.map((t) => getCardIdsFromTermId(t)).filter(Boolean))
  );
}

export function getTermIdsFromCardIds(ids: CardIds): TermIds {
  return uniq(flatten(ids.map((id) => getTermIds(id))));
}

/** Used for testing */
export function getCardIdByText(text: string): CardId {
  const id = (getHashForVocabulary(text) + "_is") as CardId;
  // const id = deck?.cards[(getHashForVocabulary(text) + "_is") as CardId]?.id;
  if (!(id in deck!.cards))
    throw new Error(`No card found with text "${text}", id would be ${id}`);
  return id;
}
