import { Card } from "../card/card";

/**
 * Returns an array of cards with all necessary dependencies of a card coming
 * before it
 */
export const withDependencies = (
  cards: Card[],
  options?: { skipSiblings?: boolean },
): Card[] => {
  let out: Card[] = [];
  for (const card of cards) {
    card.row.dependencies.forEach((dependency) => {});
  }

  getRowIdsFromCardIds(cardIds).forEach((rowId) => {
    let k = getSortedCardDependenciesAsCardIds(rowId);

    // /* Filter siblings, leaving dependencies */
    // if (options?.skipSiblings) {
    //   k = k.filter(
    //     (cardId) =>
    //       !getCardIdsFromRowId(rowId).includes(cardId) ||
    //       cardIds.includes(cardId),
    //   );
    // }

    out = out.concat(k);
  });
  return _.uniq(out);
};
