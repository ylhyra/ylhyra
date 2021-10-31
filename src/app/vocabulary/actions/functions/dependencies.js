import {
  getCardsByIds,
  getIdsFromCards,
  getTermsFromCards,
} from "app/vocabulary/actions/card/functions";
import _ from "underscore";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 * @param {Array.<Card>} cards
 * @param {object=} options
 *  skipSiblings
 * @returns {Array.<Card>}
 */
export const withDependencies = (cards, options) => {
  let card_ids = [];
  getTermsFromCards(cards).forEach((term) => {
    let k = term.getSortedCardDependenciesAsCardIds();

    /* Filter siblings, leaving dependencies */
    if (options?.skipSiblings) {
      k = k.filter(
        (card_id) =>
          !term.getCardIds().includes(card_id) ||
          getIdsFromCards(cards).includes(card_id)
      );
    }

    card_ids = card_ids.concat(k);
  });
  return getCardsByIds(_.uniq(card_ids));
};
