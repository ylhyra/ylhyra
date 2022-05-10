import { getSortedCardDependenciesAsCardIds } from "flashcards/flashcards/actions/card/cardDependencies";
import { CardIds } from "flashcards/flashcards/types";
import _ from "underscore";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 */
export const withDependencies = (
  cardIds: CardIds,
  options?: { skipSiblings?: boolean }
): CardIds => {
  let out: CardIds = [];
  getRowIdsFromCardIds(cardIds).forEach((rowId) => {
    let k = getSortedCardDependenciesAsCardIds(rowId);

    /* Filter siblings, leaving dependencies */
    if (options?.skipSiblings) {
      k = k.filter(
        (cardId) =>
          !getCardIdsFromRowId(rowId).includes(cardId) ||
          cardIds.includes(cardId)
      );
    }

    out = out.concat(k);
  });
  return _.uniq(out);
};
