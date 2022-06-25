import { Card } from "flashcards/flashcards/actions/card/card";
import { sortBy } from "underscore";

export function oldestFirst(cards: Card[]) {
  return sortBy(cards, (card) => card.getRowLastSeen());
}

// export function newestFirst (ids: Card[]) {
//   return oldestFirst(ids).reverse();
// };

export function veryRecentlySeenSortedLast(cards: Card[]) {
  return sortBy(cards, (card) => card.wasRowVeryRecentlySeen());
}

// const wasRowVeryRecentlySeen2_temp = (id, time) => {
//   return [id, ...deck!.cards_temp[id].siblingCardIds].some((sibling_id) => {
//     const lastSeen = getEntireSchedule()[sibling_id]?.lastSeen;
//     return lastSeen && time - lastSeen < 45 * minutes;
//   });
// };

export function sortCardsByScore(cards: Card[]) {
  return sortBy(cards, (card) => card.getScore());
}

export function sortBySortKey(cards: Card[]) {
  return sortBy(cards, (card) => card.getSortKey());
}
