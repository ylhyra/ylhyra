import { getSortKey } from "flashcards/flashcards/actions/card/card_data";
import {
  getScore,
  getTermLastSeen,
  wasTermVeryRecentlySeen,
} from "flashcards/flashcards/actions/card/card_schedule";
import { sortBy } from "underscore";

export const oldestFirst = (ids: CardIds) => {
  return sortBy(ids, (id) => getTermLastSeen(id));
};

// export const newestFirst = (ids: CardIds) => {
//   return oldestFirst(ids).reverse();
// };

export const veryRecentlySeenSortedLast = (ids: CardIds) => {
  return sortBy(ids, (id) => wasTermVeryRecentlySeen(id));
};

// const wasTermVeryRecentlySeen2_temp = (id, time) => {
//   return [id, ...deck!.cards_temp[id].siblingCardIds].some((sibling_id) => {
//     const last_seen = deck!.schedule[sibling_id]?.last_seen;
//     return last_seen && time - last_seen < 45 * minutes;
//   });
// };

export const sortCardsByScore = (ids: CardIds) => {
  return sortBy(ids, (id) => getScore(id));
};

export const sortBySortKey = (ids: CardIds, options?) => {
  return sortBy(ids, (id) => getSortKey(id, options));
};