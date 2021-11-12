import { deck } from "app/vocabulary/actions/deck";
import { flatten, uniq } from "underscore";
import { getHash } from "maker/vocabulary_maker/compile/functions";
import { getSessions } from "app/vocabulary/actions/userData/userDataSessions";

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
  return uniq(
    flatten(term_ids.map((t) => getTermById(t)?.getCardIds()).filter(Boolean))
  );
};

/**
 * @param {Array.<TermID>} term_ids
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
 * @param {Array.<CardID>} card_ids
 * @returns {Array.<TermID>}
 */
export const getTermIdsFromCardIds = (card_ids) => {
  return uniq(
    flatten(getCardsByIds(card_ids).map((card) => card.getTermIds()))
  );
};

/**
 * @param {string} text
 * @returns {?Card}
 */
export const getCardByText = (text) => {
  return deck.cards[getHash(text) + "_is"];
};

export const rememoizeCards = () => {
  deck.cards_sorted.forEach((card) => {
    card.memoize();
  });
};
