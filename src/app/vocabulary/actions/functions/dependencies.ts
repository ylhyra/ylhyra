import {
  getCardsByIds,
  getIdsFromCards,
  getTermsFromCards,
} from "app/vocabulary/actions/card/functions";
import _ from "underscore";
import { CardIds } from "app/vocabulary/actions/card/card";
import { getCardIds } from "app/vocabulary/actions/card/term";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 */
export const withDependencies = (ids, options?): CardIds => {
  let out: CardIds = [];
  getTermsFromCards(ids).forEach((term_id) => {
    let k = termGetSortedCardDependenciesAsCardIds(term_id);

    /* Filter siblings, leaving dependencies */
    if (options?.skipSiblings) {
      k = k.filter(
        (card_id) =>
          !getCardIds(term_id).includes(card_id) ||
          // TODO?? Hvað er þetta?
          getIdsFromCards(cards).includes(card_id)
      );
    }

    out = out.concat(k);
  });
  return getCardsByIds(_.uniq(out));
};
