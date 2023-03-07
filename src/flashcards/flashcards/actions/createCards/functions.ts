import { Card } from "flashcards/flashcards/actions/card/card";
import {
  getRowLastSeen,
  wasRowVeryRecentlySeen,
} from "flashcards/flashcards/actions/card/cardSchedule";
import { sortBy } from "underscore";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { sortByMultiple } from "modules/sortByMultiple";
// @ts-ignore
import murmurhash from "murmurhash";

export function oldestFirst(cards: Card[]) {
  return sortBy(cards, (card) => getRowLastSeen(card));
}

// export function newestFirst (ids: Card[]) {
//   return oldestFirst(ids).reverse();
// };

export function veryRecentlySeenSortedLast(cards: Card[]) {
  return sortBy(cards, (card) => wasRowVeryRecentlySeen(card));
}

// const wasRowVeryRecentlySeen2_temp = (id, time) => {
//   return [id, ...deck!.cards_temp[id].siblingCardIds].some((sibling_id) => {
//     const lastSeen = getEntireSchedule()[sibling_id]?.lastSeen;
//     return lastSeen && time - lastSeen < 45 * minutes;
//   });
// };

export function sortCardsByScore(cards: Card[]) {
  return sortBy(cards, (card) => card.score);
}

export function sortCards(
  cards: Card[],
  deck: Deck,
  type: "NEW" | "OLD",
): Card[] {
  let output: Card[] = [];

  let sortByFunctions: Array<(arg0: Card) => number> = [];

  switch (
    type === "NEW"
      ? deck.getSetting("newCardPrioritization")
      : deck.getSetting("oldCardPrioritization")
  ) {
    case "RANDOM":
      /** Sort by a hash of the row number */
      sortByFunctions.push((card) =>
        murmurhash(card.row.data.rowNumber.toString()),
      );
      break;
    case "OLDEST":
      // Todo: Find creation date
      sortByFunctions.push((card) => card.row.data.rowNumber);
      break;
    case "NEWEST":
      // Todo: Find creation date
      sortByFunctions.push((card) => -card.row.data.rowNumber);
      break;
    case "EASIEST":
      throw new Error("Not implemented");
    case "HARDEST":
      throw new Error("Not implemented");
    case "OLDEST_SEEN":
      throw new Error("Not implemented");
    case "NEWEST_SEEN":
      throw new Error("Not implemented");
    default:
      throw new Error("No prioritization method selected");
  }

  return /*shuffleLocally*/ sortByMultiple(cards, ...sortByFunctions);
}
