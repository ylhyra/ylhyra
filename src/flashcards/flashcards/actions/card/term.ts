import { isInSchedule } from "flashcards/flashcards/actions/card/card_schedule";
import { deck } from "flashcards/flashcards/actions/deck";

export const getTermData = (termId: TermId): Terms[TermId] | undefined => {
  return deck?.terms[termId];
};

export const getCardIdsFromTermId = (termId: TermId): CardIds => {
  return getTermData(termId)?.cards || [];
};

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
