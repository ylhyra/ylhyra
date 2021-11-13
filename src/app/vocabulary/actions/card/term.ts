import { deck } from "app/vocabulary/actions/deck";
import { CardIds, TermId } from "app/vocabulary/actions/card/card";

export const getTermData = (term_id: TermId) => {
  return deck.terms[term_id];
};

export const getCardIds = (term_id: TermId): CardIds => {
  return getTermData(term_id).cards;
};
export const getCardIdsFromTermId = getCardIds;

// export const getCardIdsShuffledIfSeen = () => {
//   if (
//     this.getCards().some((card) => card.isInSchedule()) &&
//     Math.random() > 0.5
//   ) {
//     return this.getCardIds().reverse();
//   } else {
//     return this.getCardIds();
//   }
// };
