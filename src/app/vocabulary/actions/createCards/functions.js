"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortBySortKey = exports.sortCardsByScore = exports.veryRecentlySeenSortedLast = exports.oldestFirst = void 0;
const card_data_1 = require("app/vocabulary/actions/card/card_data");
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const underscore_1 = require("underscore");
const oldestFirst = (ids) => {
    return (0, underscore_1.sortBy)(ids, (id) => (0, card_schedule_1.getTermLastSeen)(id));
};
exports.oldestFirst = oldestFirst;
// export const newestFirst = (ids: CardIds) => {
//   return oldestFirst(ids).reverse();
// };
const veryRecentlySeenSortedLast = (ids) => {
    return (0, underscore_1.sortBy)(ids, (id) => (0, card_schedule_1.wasTermVeryRecentlySeen)(id));
    // let time = getTime();
    // return sortBy(cards, (i) => wasTermVeryRecentlySeen2_temp(i.getId()), time)
};
exports.veryRecentlySeenSortedLast = veryRecentlySeenSortedLast;
// const wasTermVeryRecentlySeen2_temp = (id, time) => {
//   return [id, ...deck.cards_temp[id].siblingCardIds].some((sibling_id) => {
//     const last_seen = deck.schedule[sibling_id]?.last_seen;
//     return last_seen && time - last_seen < 45 * minutes;
//   });
// };
const sortCardsByScore = (ids) => {
    return (0, underscore_1.sortBy)(ids, (id) => (0, card_schedule_1.getScore)(id));
};
exports.sortCardsByScore = sortCardsByScore;
const sortBySortKey = (ids, options) => {
    return (0, underscore_1.sortBy)(ids, (id) => (0, card_data_1.getSortKey)(id, options));
};
exports.sortBySortKey = sortBySortKey;
