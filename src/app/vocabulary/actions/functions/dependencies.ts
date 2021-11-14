import { getTermIdsFromCardIds } from "app/vocabulary/actions/card/functions";
import _ from "underscore";
import { getCardIds } from "app/vocabulary/actions/card/term";
import { getSortedCardDependenciesAsCardIds } from "app/vocabulary/actions/card/card_dependencies";
import { CardIds } from "app/vocabulary/actions/card/types";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 */
export const withDependencies = (card_ids, options?): CardIds => {
  let out: CardIds = [];
  getTermIdsFromCardIds(card_ids).forEach((term_id) => {
    let k = getSortedCardDependenciesAsCardIds(term_id);

    /* Filter siblings, leaving dependencies */
    if (options?.skipSiblings) {
      k = k.filter(
        (card_id) =>
          !getCardIds(term_id).includes(card_id) || card_ids.includes(card_id)
      );
    }

    out = out.concat(k);
  });
  return _.uniq(out);
};
