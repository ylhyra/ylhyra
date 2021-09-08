import { deck } from "app/vocabulary/actions/deck";
import _ from "underscore";

export const getCardById = (card_id) => {
  return deck.cards[card_id] || null;
};

export const getCardsByIds = (card_ids) => {
  return card_ids.map(getCardById).filter(Boolean);
};

export const getIdsFromCards = (cards) => {
  return cards.map((c) => c.getId());
};

export const getTermById = (term_id) => {
  return deck.terms[term_id] || null;
};

export const getTermsByIds = (term_ids) => {
  return term_ids.map(getTermById).filter(Boolean);
};

export const getCardsFromTermId = (term_id) => {
  return _.uniq(_.flatten(getTermById(term_id)?.getCards() || []));
};

export const getCardsFromTermIds = (term_ids) => {
  return _.uniq(_.flatten(term_ids.map(getCardsFromTermId).filter(Boolean)));
};

export const getCardsInSchedule = () => {
  return Object.keys(deck.schedule).map(getCardById).filter(Boolean);
};

export const getNewCards = () => {
  return deck.cards_sorted.filter((card) => !card.isInSchedule());
};
export const getCardIdsFromTermIds = (term_ids) => {
  return _.uniq(
    _.flatten(term_ids.map((t) => deck.terms[t]?.cards)).filter(Boolean)
  );
};
export const getTermsFromCards = (cards) => {
  return getTermIdsFromCardIds(cards.map((c) => c.getId())).map(getTermById);
};
export const getTermIdsFromCardIds = (card_ids) => {
  let terms = [];
  card_ids.forEach((id) => {
    terms = terms.concat(deck.cards[id].terms);
  });
  return _.uniq(terms);
};
