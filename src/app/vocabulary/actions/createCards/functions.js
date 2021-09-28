import { sortBy } from "app/app/functions/sortBy";

/**
 * @param {Array.<Card>} cards
 * @returns {Array.<Card>}
 */
export const oldestFirst = (cards) => {
  return sortBy(cards, (i) => i.getTermLastSeen());
};

/**
 * @param {Array.<Card>} cards
 * @returns {Array.<Card>}
 */
export const newestFirst = (cards) => {
  return oldestFirst(cards).reverse();
};

/**
 * @param {Array.<Card>} cards
 * @returns {Array.<Card>}
 */
export const veryRecentlySeenSortedLast = (cards) => {
  return sortBy(cards, (i) => i.wasTermVeryRecentlySeen());
};

/**
 * @param {Array.<Card>} cards
 * @returns {Array.<Card>}
 */
export const sortCardsByScore = (cards) => {
  return sortBy(cards, (i) => i.getScore());
};

/**
 * @param {Array.<Card>} cards
 * @returns {Array.<Card>}
 */
export const sortBySortKey = (cards) => {
  return cards.sort((a, b) => a.sortKey - b.sortKey);
};
