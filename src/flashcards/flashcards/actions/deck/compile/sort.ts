import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { TermIds } from "flashcards/flashcards/types/types";

export const getSortedTermIds = (
  unprocessedDeck: Deck,
  processedDeck: Deck
): TermIds => {
  throw new Error("Not implemented");
  // let termIds: TermIds = keys(processedDeck.terms).sort((termId1, termId2) => {
  // const a = unprocessedDeck.rows[getRowId(termId1)];
  // const b = unprocessedDeck.rows[getRowId(termId2)];
  // return 0;
  // return compare(a, b,);
  // a.level - b.level ||
  // (b.hasOwnProperty("sortKey") ? 1 : 0) -
  //   (a.hasOwnProperty("sortKey") ? 1 : 0) ||
  // a.sortKey - b.sortKey ||
  // (Boolean(b.sound) ? 1 : 0) - (Boolean(a.sound) ? 1 : 0) ||
  // (a.row_id! % 100) - (b.row_id! % 100) ||
  // a.row_id! - b.row_id!
  // });
  // .sort(
  //   (a, b) =>
  //     a.level - b.level ||
  //     (b.hasOwnProperty("sortKey") ? 1 : 0) -
  //       (a.hasOwnProperty("sortKey") ? 1 : 0) ||
  //     a.sortKey - b.sortKey ||
  //     (Boolean(b.sound) ? 1 : 0) - (Boolean(a.sound) ? 1 : 0) ||
  //     (a.row_id! % 100) - (b.row_id! % 100) ||
  //     a.row_id! - b.row_id!
  // )
  // .map((term) => {
  //   return term.id!;
  // });

  // /* Run empty to remove cyclical dependencies */
  // withDependencies__backend(cardIds);
  // /* Run again now that  cyclical dependencies are gone */
  // termIds = sortDependenciesBeforeCardsThatDependOnThem(processedDeck, termIds);
  // termIds.forEach((cardId, index) => {
  //   processedDeck!.cards[cardId].sortKey = index;
  // });

  // return termIds;
};
