import { sortBy } from "underscore";
import { CardIds } from "app/vocabulary/actions/card/card";
import {
  getScore,
  getTermLastSeen,
  wasTermVeryRecentlySeen,
} from "app/vocabulary/actions/card/card_schedule";
import { getSortKey } from "app/vocabulary/actions/card/card_data";

export const oldestFirst = (ids: CardIds) => {
  return sortBy(ids, (id) => getTermLastSeen(id));
};

// export const newestFirst = (ids: CardIds) => {
//   return oldestFirst(ids).reverse();
// };

export const veryRecentlySeenSortedLast = (ids: CardIds) => {
  return sortBy(ids, (id) => wasTermVeryRecentlySeen(id));
  // let time = getTime();
  // return sortBy(cards, (i) => wasTermVeryRecentlySeen2_temp(i.getId()), time)
};

// const wasTermVeryRecentlySeen2_temp = (id, time) => {
//   return [id, ...deck.cards_temp[id].siblingCardIds].some((sibling_id) => {
//     const last_seen = deck.schedule[sibling_id]?.last_seen;
//     return last_seen && time - last_seen < 45 * minutes;
//   });
// };

export const sortCardsByScore = (ids: CardIds) => {
  return sortBy(ids, (id) => getScore(id));
};

export const sortBySortKey = (ids: CardIds, options?) => {
  return sortBy(ids, (id) => getSortKey(id, options));
};
