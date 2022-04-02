import _ from "underscore";
import { getSortedCardDependenciesAsCardIds } from "ylhyra/app/vocabulary/actions/card/card_dependencies";
import { getTermIdsFromCardIds } from "ylhyra/app/vocabulary/actions/card/functions";
import { getCardIdsFromTermId } from "ylhyra/app/vocabulary/actions/card/term";
import { CardIds } from "ylhyra/app/vocabulary/actions/card/types";

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
