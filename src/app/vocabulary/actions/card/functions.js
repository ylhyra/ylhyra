import { deck } from "app/vocabulary/actions/deck";
import _ from "underscore";

/**
 * @param {string} card_id
 * @returns {Card|null}
 */
export const getCardById = (card_id) => {
  return deck.cards[card_id] || null;
};

/**
 * @param {Array.<string>} card_ids
 * @returns {Array.<Card>}
 */
export const getCardsByIds = (card_ids) => {
  return card_ids.map(getCardById).filter(Boolean);
};

/**
 * @param {Array.<Card>} cards
 * @returns {Array.<string>}
 */
export const getIdsFromCards = (cards) => {
  return cards.map((c) => c.getId());
};

/**
 * @param {string} term_id
 * @returns {Term|null}
 */
export const getTermById = (term_id) => {
  return deck.terms[term_id] || null;
};

/**
 * @param {Array.<string>} term_ids
 * @returns {Array.<Term>}
 */
export const getTermsByIds = (term_ids) => {
  return term_ids.map(getTermById).filter(Boolean);
};

/**
 * @param {string} term_id
 * @returns {Array.<Card>}
 */
export const getCardsFromTermId = (term_id) => {
  return getTermById(term_id)?.getCards() || [];
};

/**
 * @param {Array.<string>} term_ids
 * @returns {Array.<string>}
 */
export const getCardIdsFromTermIds = (term_ids) => {
  return _.uniq(
    _.flatten(term_ids.map((t) => getTermById(t)?.getCardIds()).filter(Boolean))
  );
};

/**
 * @param {Array.<string>} term_ids
 * @returns {Array.<Card>}
 */
export const getCardsFromTermIds = (term_ids) => {
  return getCardsByIds(getCardIdsFromTermIds(term_ids));
};

/**
 * @returns {Array.<Card>}
 */
export const getCardsInSchedule = () => {
  return getCardsByIds(Object.keys(deck.schedule));
};

/**
 * @param {Array.<Card>} cards
 * @returns {Array.<Term>}
 */
export const getTermsFromCards = (cards) => {
  return getTermIdsFromCardIds(cards.map((c) => c.getId())).map(getTermById);
};

/**
 * @param {Array.<string>} card_ids
 * @returns {Array.<string>}
 */
export const getTermIdsFromCardIds = (card_ids) => {
  let terms = [];
  card_ids.forEach((id) => {
    terms = terms.concat(deck.cards[id].terms);
  });
  return _.uniq(terms);
};
