import { deck } from "app/vocabulary/actions/deck";
import _ from "underscore";

export const getCardById = (card_id) => {
  return deck.cards[card_id] || null;
};

export const getCardsByIds = (card_ids) => {
  return card_ids.map(getCardById).filter(Boolean);
};

export const getTermById = (term_ids) => {
  return deck.terms[term_ids] || null;
};

export const getTermsByIds = (term_ids) => {
  return term_ids.map(getTermById).filter(Boolean);
};

export const getCardsFromTermId = (term_id) => {
  return _.uniq(_.flatten(getTermById(term_id).getCards()));
};

export const getCardsFromTermIds = (term_ids) => {
  return term_ids.map(getCardsFromTermId).filter(Boolean);
};

export const getCardsInSchedule = () => {
  return Object.keys(deck.schedule).map(getCardById).filter(Boolean);
};

export const getNewCards = () => {
  return deck.cards.filter((card) => !card.isInSchedule());
};
