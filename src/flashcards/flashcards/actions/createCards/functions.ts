import { getSortKey } from "flashcards/flashcards/actions/card/cardData";
import { CardIds } from "flashcards/flashcards/types/types";
import { sortBy } from "underscore";

export const oldestFirst = (ids: CardIds) => {
  return sortBy(ids, (id) => id.getTermLastSeen());
};

// export const newestFirst = (ids: CardIds) => {
//   return oldestFirst(ids).reverse();
// };

export const veryRecentlySeenSortedLast = (ids: CardIds) => {
  return sortBy(ids, (id) => id.wasTermVeryRecentlySeen());
};

// const wasTermVeryRecentlySeen2_temp = (id, time) => {
//   return [id, ...deck!.cards_temp[id].siblingCardIds].some((sibling_id) => {
//     const lastSeen = getEntireSchedule()[sibling_id]?.lastSeen;
//     return lastSeen && time - lastSeen < 45 * minutes;
//   });
// };

export const sortCardsByScore = (ids: CardIds) => {
  return sortBy(ids, (id) => id.getScore());
};

export const sortBySortKey = (ids: CardIds, options?) => {
  return sortBy(ids, (id) => getSortKey(id, options));
};
