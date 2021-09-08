import { getCardsByIds } from "app/vocabulary/actions/card/functions";
import _ from "underscore";
import { getTermsFromCards } from "app/vocabulary/actions/functions/index";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 */
export const withDependencies = (cards) => {
  let card_ids = [];
  getTermsFromCards(cards).forEach((term) => {
    term.getSortedCardDependencies().forEach((card) => {
      card_ids.push(card.getId());
    });
  });
  return getCardsByIds(_.uniq(card_ids));
};
