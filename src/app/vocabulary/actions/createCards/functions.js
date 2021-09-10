/**
 * @param {Array.<Card>} cards
 * @returns {Array.<Card>}
 */
export const oldestFirst = (cards) => {
  return cards.sort((a, b) => a.getTermLastSeen() - b.getTermLastSeen());
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
export const sortCardsByScore = (cards) => {
  return cards.sort((a, b) => a.getScore() - b.getScore());
};

/**
 * @param {Array.<Card>} cards
 * @returns {Array.<Card>}
 */
export const sortBySortKey = (cards) => {
  return cards.sort((a, b) => a.sortKey - b.sortKey);
};
