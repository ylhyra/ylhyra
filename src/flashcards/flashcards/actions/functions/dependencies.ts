import { getSortedCardDependenciesAsCardIds } from "flashcards/flashcards/actions/card/cardDependencies";
import {
  getCardIdsFromTermId,
  getTermIdsFromCardIds,
} from "flashcards/flashcards/actions/card/term";
import { CardIds } from "flashcards/flashcards/types/types";
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
  getTermIdsFromCardIds(cardIds).forEach((termId) => {
    let k = getSortedCardDependenciesAsCardIds(termId);

    /* Filter siblings, leaving dependencies */
    if (options?.skipSiblings) {
      k = k.filter(
        (cardId) =>
          !getCardIdsFromTermId(termId).includes(cardId) ||
          cardIds.includes(cardId)
      );
    }

    out = out.concat(k);
  });
  return _.uniq(out);
};
