import { deck } from "app/vocabulary/actions/deck";
import { flatten, uniq } from "underscore";
import { getHash } from "maker/vocabulary_maker/compile/functions";
import { getSessions } from "app/vocabulary/actions/userData/userDataSessions";
import { clearTimeMemoized } from "app/app/functions/time";

// export const getCardById = (card_id) => {
//   return deck.cards[card_id] || null;
// };
//
// export const getCardsByIds = (card_ids) => {
//   return card_ids.map(getCardById).filter(Boolean);
// };
//
// export const getIdsFromCards = (cards) => {
//   return cards.map((c) => c.getId());
// };
//
// export const getTermById = (term_id) => {
//   return deck.terms[term_id] || null;
// };
//
// export const getTermsByIds = (term_ids) => {
//   return term_ids.map(getTermById).filter(Boolean);
// };

export const getCardsFromTermId = (term_id) => {
  return getTermById(term_id)?.getCards() || [];
};

export const getCardIdsFromTermIds = (term_ids) => {
  return uniq(
    flatten(term_ids.map((t) => getTermById(t)?.getCardIds()).filter(Boolean))
  );
};

export const getCardsFromTermIds = (term_ids) => {
  return getCardsByIds(getCardIdsFromTermIds(term_ids));
};

export const getCardsInSchedule = () => {
  return getCardsByIds(Object.keys(deck.schedule));
};

export const getTermsFromCards = (cards): TermIds => {
  return getTermIdsFromCardIds(cards.map((c) => c.getId())).map(getTermById);
};

export const getTermIdsFromCardIds = (card_ids) => {
  return uniq(
    flatten(getCardsByIds(card_ids).map((card) => card.getTermIds()))
  );
};

export const getCardByText = (text) => {
  return deck.cards[getHash(text) + "_is"];
};

export const rememoizeCards = () => {
  // deck.cards_sorted.forEach((card) => {
  //   card.clearMemoizations();
  // });
  clearTimeMemoized();
};
