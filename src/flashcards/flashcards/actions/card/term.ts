import { isInSchedule } from "flashcards/flashcards/actions/card/cardSchedule";
import { Row } from "flashcards/flashcards/types/row";
import { CardIds, TermId, TermIds } from "flashcards/flashcards/types/types";
import { flatten, uniq } from "underscore";

export const getTermData = (termId: TermId): Row | undefined => {
  throw new Error("Not implemented");
  // return getTermsFromAllDecks()[termId];
};

export const getCardIdsFromTermId = (termId: TermId): CardIds => {
  throw new Error("Not implemented");
  // return getTermData(termId)?.cards || [];
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
