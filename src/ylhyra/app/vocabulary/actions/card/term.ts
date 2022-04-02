import { isInSchedule } from "ylhyra/app/vocabulary/actions/card/card_schedule";
import { CardIds, TermId } from "ylhyra/app/vocabulary/actions/card/types";
import { deck } from "ylhyra/app/vocabulary/actions/deck";

export const getTermData = (termId: TermId) => {
  return deck?.terms[termId];
};

export const getCardIdsFromTermId = (termId: TermId): CardIds => {
  return getTermData(termId)?.cards || [];
};

export const getCardIdsShuffledIfSeen = (termId: TermId) => {
  if (
    getCardIdsFromTermId(termId).some((cardId) => isInSchedule(cardId)) &&
    Math.random() > 0.5
  ) {
    return getCardIdsFromTermId(termId).reverse();
  } else {
    return getCardIdsFromTermId(termId);
  }
};
