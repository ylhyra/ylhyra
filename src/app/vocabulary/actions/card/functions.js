import { deck } from "app/vocabulary/actions/deck";
import { flatten, uniq } from "underscore";

/**
 * @param {CardID} card_id
 * @returns {Card|null}
 */
export const getCardById = (card_id) => {
  return deck.cards[card_id] || null;
};

/**
 * @param {Array.<CardID>} card_ids
 * @returns {Array.<Card>}
 */
export const getCardsByIds = (card_ids) => {
  return card_ids.map(getCardById).filter(Boolean);
};

/**
 * @param {Array.<Card>} cards
 * @returns {Array.<CardID>}
 */
export const getIdsFromCards = (cards) => {
  return cards.map((c) => c.getId());
};

/**
 * @param {TermID} term_id
 * @returns {Term|null}
 */
export const getTermById = (term_id) => {
  return deck.terms[term_id] || null;
};

/**
 * @param {Array.<TermID>} term_ids
 * @returns {Array.<Term>}
 */
export const getTermsByIds = (term_ids) => {
  return term_ids.map(getTermById).filter(Boolean);
};

/**
 * @param {TermID} term_id
 * @returns {Array.<Card>}
 */
export const getCardsFromTermId = (term_id) => {
  return getTermById(term_id)?.getCards() || [];
};

/**
 * @param {Array.<TermID>} term_ids
 * @returns {Array.<CardID>}
 */
export const getCardIdsFromTermIds = (term_ids) => {
  return (
    term_ids.map((t) => getTermById(t)?.getCardIds()).filter(Boolean)
    |> flatten
    |> uniq
  );
};

/**
 * @param {Array.<TermID>} term_ids
 * @returns {Array.<Card>}
 */
export const getCardsFromTermIds = (term_ids) => {
  return term_ids |> getCardIdsFromTermIds |> getCardsByIds;
};

/**
 * @returns {Array.<Card>}
 */
export const getCardsInSchedule = () => {
  return Object.keys(deck.schedule) |> getCardsByIds;
};

/**
 * @param {Array.<Card>} cards
 * @returns {Array.<Term>}
 */
export const getTermsFromCards = (cards) => {
  return (cards.map((c) => c.getId()) |> getTermIdsFromCardIds).map(
    getTermById
  );
};

/**
 * @param {Array.<CardID>} card_ids
 * @returns {Array.<TermID>}
 */
export const getTermIdsFromCardIds = (card_ids) => {
  return (
    getCardsByIds(card_ids).map((card) => card.getTermIds()) |> flatten |> uniq
  );
};
