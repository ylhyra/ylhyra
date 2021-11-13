import { deck } from "app/vocabulary/actions/deck";
import { CardId, CardIds, isInSession } from "app/vocabulary/actions/card/card";
import { BAD } from "app/vocabulary/actions/card/card_difficulty";
import { getTermIds } from "app/vocabulary/actions/card/card_data";
import CardInSession from "app/vocabulary/actions/cardInSession";
import _ from "underscore";
import { getCardIdsFromTermId } from "app/vocabulary/actions/card/term";

export const getSiblingCards = (id: CardId): CardIds => {
  // return (this.siblingCardIds);
  return getAllCardIdsWithSameTerm(id).filter(
    (sibling_card_id) => sibling_card_id !== id
  );
};

export const getSiblingCardsInSession = (id: CardId): Array<CardInSession> => {
  return getSiblingCards(id)
    .filter((card) => isInSession(card))
    .map((card) => getAsCardInSession(card));
};

export const getAsCardInSession = (id: CardId): CardInSession => {
  return deck.session.cards.find((card) => card.id === id);
};

export const didAnySiblingCardsGetABadRatingInThisSession = (id: CardId) => {
  return getSiblingCards(id).some((sibling_card_id) => {
    return getAsCardInSession(sibling_card_id)?.history.includes(BAD);
  });
};

export const getAllCardIdsWithSameTerm = (id: CardId): CardIds => {
  // return memoize(id, "getAllCardIdsWithSameTerm", () => {
  let out = [];
  getTermIds(id).forEach((term) => {
    out = out.concat(getCardIdsFromTermId(term));
  });
  return _.uniq(out);
  // });
};
