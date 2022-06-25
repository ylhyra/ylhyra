import { sortBy } from "underscore";
import { getSortKey } from "ylhyra/vocabulary/app/actions/card/card_data";
import {
  getScore,
  getTermLastSeen,
  wasTermVeryRecentlySeen,
} from "ylhyra/vocabulary/app/actions/card/card_schedule";
import { CardIds } from "ylhyra/vocabulary/types";

export function oldestFirst(ids: CardIds) {
  return sortBy(ids, (id) => getTermLastSeen(id));
}

// export function newestFirst (ids: CardIds) {
//   return oldestFirst(ids).reverse();
// };

export function veryRecentlySeenSortedLast(ids: CardIds) {
  return sortBy(ids, (id) => wasTermVeryRecentlySeen(id));
  // let time = getTime();
  // return sortBy(cards, (i) => wasTermVeryRecentlySeen2_temp(i.getId()), time)
}

// const wasTermVeryRecentlySeen2_temp = (id, time) => {
//   return [id, ...deck!.cards_temp[id].siblingCardIds].some((sibling_id) => {
//     const last_seen = deck!.schedule[sibling_id]?.last_seen;
//     return last_seen && time - last_seen < 45 * minutes;
//   });
// };

export function sortCardsByScore(ids: CardIds) {
  return sortBy(ids, (id) => getScore(id));
}

export function sortBySortKey(ids: CardIds, options?) {
  return sortBy(ids, (id) => getSortKey(id, options));
}
