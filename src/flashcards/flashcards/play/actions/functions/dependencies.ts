import _ from "underscore";
import { getSortedCardDependenciesAsCardIds } from "ylhyra/vocabulary/app/actions/card/card_dependencies";
import { getTermIdsFromCardIds } from "ylhyra/vocabulary/app/actions/card/functions";
import { getCardIdsFromTermId } from "ylhyra/vocabulary/app/actions/card/term";
import { CardIds } from "ylhyra/vocabulary/types";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 */
export const withDependencies = (cardIds, options?): CardIds => {
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
