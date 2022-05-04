import { isInSession } from "flashcards/flashcards/actions/card/card";
import { getTermIds } from "flashcards/flashcards/actions/card/cardData";
import { getCardIdsFromTermId } from "flashcards/flashcards/actions/card/term";
import CardInSession from "flashcards/flashcards/actions/cardInSession";
import { filterEmpty } from "modules/typescript/filterEmpty";
import _ from "underscore";
import { Rating } from "flashcards/flashcards/types/types";

export const getSiblingCards = (id: CardId): CardIds => {
  // return (this.siblingCardIds);
  return getAllCardIdsWithSameTerm(id).filter(
    (sibling_cardId) => sibling_cardId !== id
  );
};

export const getSiblingCardsInSession = (id: CardId): Array<CardInSession> => {
  return getSiblingCards(id)
    .filter((card) => isInSession(card))
    .map((card) => getAsCardInSession(card))
    .filter(filterEmpty);
};

export const getAsCardInSession = (id: CardId): CardInSession | undefined => {
  return deck?.session.cards?.find((card) => card.id === id);
};

export const didAnySiblingCardsGetABadRatingInThisSession = (id: CardId) => {
  return getSiblingCards(id).some((sibling_cardId) => {
    return getAsCardInSession(sibling_cardId)?.history.includes(Rating.BAD);
  });
};

export const getAllCardIdsWithSameTerm = (id: CardId): CardIds => {
  // return memoize(id, "getAllCardIdsWithSameTerm", () => {
  let out: CardIds = [];
  getTermIds(id).forEach((term) => {
    out = out.concat(getCardIdsFromTermId(term));
  });
  return _.uniq(out);
  // });
};
