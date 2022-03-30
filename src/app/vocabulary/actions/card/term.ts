import { isInSchedule } from "app/vocabulary/actions/card/card_schedule";
import { CardIds, TermId } from "app/vocabulary/actions/card/types";
import { deck } from "app/vocabulary/actions/deck";

export const getTermData = (term_id: TermId) => {
  return deck.terms[term_id];
};

export const getCardIds = (term_id: TermId): CardIds => {
  return getTermData(term_id).cards;
};
export const getCardIdsFromTermId = getCardIds;

export const getCardIdsShuffledIfSeen = (term_id: TermId) => {
  if (
    getCardIds(term_id).some((card_id) => isInSchedule(card_id)) &&
    Math.random() > 0.5
  ) {
    return getCardIds(term_id).reverse();
  } else {
    return getCardIds(term_id);
  }
};
