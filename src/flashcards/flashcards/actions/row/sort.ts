import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { RowIds } from "flashcards/flashcards/actions/row/rowData.types";

export const getSortedRowIds = (
  unprocessedDeck: Deck,
  processedDeck: Deck
): RowIds => {
  throw new Error("Not implemented");
  // let rowIds: RowIds = keys(processedDeck.rows).sort((rowId1, rowId2) => {
  // const a = unprocessedDeck.rows[getRowId(rowId1)];
  // const b = unprocessedDeck.rows[getRowId(rowId2)];
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
  // .map((row) => {
  //   return row.id!;
  // });

  // /* Run empty to remove cyclical dependencies */
  // withDependencies__backend(cardIds);
  // /* Run again now that  cyclical dependencies are gone */
  // rowIds = sortDependenciesBeforeCardsThatDependOnThem(processedDeck, rowIds);
  // rowIds.forEach((cardId, index) => {
  //   processedDeck!.cards[cardId].sortKey = index;
  // });

  // return rowIds;
};