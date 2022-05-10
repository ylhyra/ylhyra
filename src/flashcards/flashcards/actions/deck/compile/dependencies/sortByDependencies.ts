import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { RowIds } from "flashcards/flashcards/types/rowData";

/**
 * Returns an array of card ids sorted in such a way that
 * dependencies (cards that the user must have studied before
 * seeing a card) always come before the card that depends on it.
 */
export const sortDependenciesBeforeCardsThatDependOnThem = (
  deck: Deck,
  rowIds: RowIds
): RowIds => {
  throw new Error("Not implemented");
  // let returns: CardIds = [];
  // let rowIds: RowIds = [];
  // let cardIdToDepth: CardIdToDependencyDepth = {};
  // if (typeof cardIds === "string") {
  //   cardIds = [cardIds];
  // }
  // cardIds
  //   .filter((cardId) => cardId in deck!.cards)
  //   .forEach((cardId) => {
  //     rowIds = rowIds.concat(getCardData(cardId, "rows"));
  //   });
  // rowIds = _.uniq(rowIds);
  // rowIds.forEach((rowId) => {
  //   let rowsWithDependencySortKey = [{ row: rowId, dependencySortKey: 0 }];
  //   const chain = dependencyToDepthForASingleRow(deck, rowId);
  //   Object.keys(chain).forEach((rowId) => {
  //     rowsWithDependencySortKey.push({
  //       row: rowId as RowId,
  //       dependencySortKey: chain[rowId as RowId],
  //     });
  //   });
  //   rowsWithDependencySortKey = rowsWithDependencySortKey.sort(
  //     (a, b) => b.dependencySortKey - a.dependencySortKey
  //   );
  //   rowsWithDependencySortKey.forEach((obj) => {
  //     rowId = obj.row;
  //     [rowId, ...(deck!.alternativeIds[rowId] || [])].forEach((j) => {
  //       if (j in deck!.rows) {
  //         let cardIds = deck!.rows[j].cards;
  //         cardIds = cardIds.sort((a) => {
  //           if (a.endsWith("is")) return -1;
  //           return 1;
  //         });
  //         returns = returns.concat(cardIds);
  //         deck!.rows[j].cards.forEach((cardId) => {
  //           cardIdToDepth[cardId as CardId] = Math.max(
  //             cardIdToDepth[cardId as CardId] || 0,
  //             obj.dependencySortKey
  //           );
  //         });
  //       }
  //     });
  //   });
  // });
  // const out = _.uniq(returns).filter((cardId) => cardId in deck!.cards);
  // return out;
};
