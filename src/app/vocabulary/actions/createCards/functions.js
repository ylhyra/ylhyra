import { deck } from "app/vocabulary/actions/deck";
import { sortBy } from "underscore";
import { getTime, minutes } from "app/app/functions/time";

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

  // let time = getTime();
  // return sortBy(cards, (i) => wasTermVeryRecentlySeen2_temp(i.getId()), time)
};

// const wasTermVeryRecentlySeen2_temp = (id, time) => {
//   return [id, ...deck.cards_temp[id].siblingCardIds].some((sibling_id) => {
//     const last_seen = deck.schedule[sibling_id]?.last_seen;
//     return last_seen && time - last_seen < 45 * minutes;
//   });
// };

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
export const sortBySortKey = (cards, options) => {
  return sortBy(cards, (i) => i.getSortKey(options));
};
