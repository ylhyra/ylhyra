import {
  getCardsByIds,
  getTermsFromCards,
} from "app/vocabulary/actions/card/functions";
import _ from "underscore";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 * @param {Array.<Card>} cards
 * @param {?object} options
 * @returns {Array.<Card>}
 */
export const withDependencies = (cards, options) => {
  let card_ids = [];
  getTermsFromCards(cards).forEach((term) => {
    let j;
    // if (options?.onlyDirect) {
    //   j = term.getSortedCardDependenciesAsCardIds({ onlyDirect: true });
    // } else {
    // }
    j = term.getSortedCardDependenciesAsCardIds();
    card_ids = card_ids.concat();
  });
  return getCardsByIds(_.uniq(card_ids));
};
