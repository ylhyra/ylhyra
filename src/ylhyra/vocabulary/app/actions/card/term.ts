import { isInSchedule } from "ylhyra/vocabulary/app/actions/card/card_schedule";
import { CardIds, TermId } from "ylhyra/vocabulary/app/actions/card/types";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { Terms } from "ylhyra/vocabulary/types";

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
