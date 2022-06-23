import { CardIds } from "flashcards/flashcards/types";

/**
 * Returns an array of cards with all necessary
 * dependencies of a card coming before it
 */
export const withDependencies = (
  cardIds: CardIds,
  options?: { skipSiblings?: boolean }
): CardIds => {
  throw new Error("Not implemented");
  // let out: CardIds = [];
  // getRowIdsFromCardIds(cardIds).forEach((rowId) => {
  //   let k = getSortedCardDependenciesAsCardIds(rowId);
  //
  //   /* Filter siblings, leaving dependencies */
  //   if (options?.skipSiblings) {
  //     k = k.filter(
  //       (cardId) =>
  //         !getCardIdsFromRowId(rowId).includes(cardId) ||
  //         cardIds.includes(cardId)
  //     );
  //   }
  //
  //   out = out.concat(k);
  // });
  // return _.uniq(out);
};
