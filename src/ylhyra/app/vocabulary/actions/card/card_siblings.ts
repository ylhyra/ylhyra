import _ from "underscore";
import { isInSession } from "ylhyra/app/vocabulary/actions/card/card";
import { getTermIds } from "ylhyra/app/vocabulary/actions/card/card_data";
import { getCardIdsFromTermId } from "ylhyra/app/vocabulary/actions/card/term";
import { CardId, CardIds } from "ylhyra/app/vocabulary/actions/card/types";
import CardInSession from "ylhyra/app/vocabulary/actions/cardInSession";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import { BAD } from "ylhyra/app/vocabulary/constants";

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
