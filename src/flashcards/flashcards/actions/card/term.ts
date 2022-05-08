import { isInSchedule } from "flashcards/flashcards/actions/card/cardSchedule";
import { getTermsFromAllDecks } from "flashcards/flashcards/stores/base/functions";
import { RowData } from "flashcards/flashcards/types/rowData";
import { CardIds, TermId, TermIds } from "flashcards/flashcards/types/types";
import { flatten, uniq } from "underscore";
import { getTermIdFromCardId } from "flashcards/flashcards/compile/ids";

export const getTermData = (termId: TermId): RowData | undefined => {
  throw new Error("Not implemented");
  // return getTermsFromAllDecks()[termId];
};

export const getCardIdsFromTermId = (termId: TermId): CardIds => {
  return getTermsFromAllDecks()[termId]?.cardIds || [];
};

export const getCardIdsFromTermIds = (termIds: TermIds) => {
  return uniq(
    flatten(termIds.map((t) => getCardIdsFromTermId(t)).filter(Boolean))
  );
};

/**
 * @deprecated
 */
export const getCardIdsShuffledIfSeen = (termId: TermId): CardIds => {
  if (
    getCardIdsFromTermId(termId).some((cardId) => isInSchedule(cardId)) &&
    Math.random() > 0.5
  ) {
    return getCardIdsFromTermId(termId).reverse();
  } else {
    return getCardIdsFromTermId(termId);
  }
};

export const getTermIdsFromCardIds = (ids: CardIds): TermIds => {
  return uniq(ids.map((id) => getTermIdFromCardId(id)));
};
