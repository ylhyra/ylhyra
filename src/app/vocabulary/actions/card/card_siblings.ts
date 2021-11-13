import { isInSession } from "app/vocabulary/actions/card/card";

export const getSiblingCards = (id: CardId) => {
  // return getCardsByIds(this.siblingCardIds);
  return getAllCardsWithSameTerm(id).filter(
    (siblingCard) => siblinggetId(card) !== id
  );
};

export const getSiblingCardsInSession = (id: CardId) => {
  return getSiblingCards(id)
    .filter((card) => isInSession(card))
    .map((card) => getAsCardInSession(card));
};

export const didAnySiblingCardsGetABadRatingInThisSession = (id: CardId) => {
  return getSiblingCards(id).some((sibling_card) => {
    return sibling_getAsCardInSession(card)?.history.includes(BAD);
  });
};

export const getAllCardIdsWithSameTerm = (id: CardId) => {
  return memoize(id, "getAllCardIdsWithSameTerm", () => {
    let out = [];
    getTerms(id).forEach((term) => {
      out = out.concat(term.getCardIds());
    });
    return _.uniq(out);
  });
};

export const getAllCardsWithSameTerm = (id: CardId) => {
  return getCardsByIds(getAllCardIdsWithSameTerm(id));
};
