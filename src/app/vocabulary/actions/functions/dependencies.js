import {
  getCardsByIds,
  getTermsFromCards,
} from "app/vocabulary/actions/card/functions";
import _ from "underscore";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 * @param {Array.<Card>} cards
 * @returns {Array.<Card>}
 */
export const withDependencies = (cards) => {
  let card_ids = [];
  getTermsFromCards(cards).forEach((term) => {
    card_ids = card_ids.concat(term.getSortedCardDependenciesAsCardIds());
  });
  return card_ids |> _.uniq |> getCardsByIds;
};
