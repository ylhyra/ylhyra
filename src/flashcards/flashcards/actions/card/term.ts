import { getDeckById } from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { isInSchedule } from "flashcards/flashcards/actions/card/cardSchedule";
import {
  getDeckId,
  getRowId,
  getTermIdFromCardId,
} from "flashcards/flashcards/actions/deck/compile/ids";
import { CardIds, TermId, TermIds } from "flashcards/flashcards/types/types";
import { flatten, uniq } from "underscore";

export const getCardIdsFromTermId = (termId: TermId): CardIds => {
  return (
    getDeckById(getDeckId(termId))?.rows[getRowId(termId)]?.getCardIds() || []
  );
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
