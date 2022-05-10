import { CardIds, TermId } from "flashcards/flashcards/types/types";

/**
 * @deprecated
 */
export const getCardIdsShuffledIfSeen = (termId: TermId): CardIds => {
  if (
    getCardIdsFromTermId(termId).some((cardId) => cardId.isInSchedule()) &&
    Math.random() > 0.5
  ) {
    return getCardIdsFromTermId(termId).reverse();
  } else {
    return getCardIdsFromTermId(termId);
  }
};
