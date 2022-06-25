import { isInSchedule } from "ylhyra/vocabulary/app/actions/card/card_schedule";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { CardIds, TermId, Terms } from "ylhyra/vocabulary/types";

export function getTermData(termId: TermId): Terms[TermId] | undefined {
  return deck?.terms[termId];
}

export function getCardIdsFromTermId(termId: TermId): CardIds {
  return getTermData(termId)?.cards || [];
}

export function getCardIdsShuffledIfSeen(termId: TermId): CardIds {
  if (
    getCardIdsFromTermId(termId).some((cardId) => isInSchedule(cardId)) &&
    Math.random() > 0.5
  ) {
    return getCardIdsFromTermId(termId).reverse();
  } else {
    return getCardIdsFromTermId(termId);
  }
}
