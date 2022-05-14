import { Card } from "flashcards/flashcards/actions/card/card";
import { sortBy } from "underscore";

export const oldestFirst = (cards: Card[]) => {
  return sortBy(cards, (card) => card.getRowLastSeen());
};

// export const newestFirst = (ids: Card[]) => {
//   return oldestFirst(ids).reverse();
// };

export const veryRecentlySeenSortedLast = (cards: Card[]) => {
  return sortBy(cards, (card) => card.wasRowVeryRecentlySeen());
};

// const wasRowVeryRecentlySeen2_temp = (id, time) => {
//   return [id, ...deck!.cards_temp[id].siblingCardIds].some((sibling_id) => {
//     const lastSeen = getEntireSchedule()[sibling_id]?.lastSeen;
//     return lastSeen && time - lastSeen < 45 * minutes;
//   });
// };

export const sortCardsByScore = (cards: Card[]) => {
  return sortBy(cards, (card) => card.getScore());
};

export const sortBySortKey = (cards: Card[]) => {
  return sortBy(cards, (card) => card.getSortKey());
};
