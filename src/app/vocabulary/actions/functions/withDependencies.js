import _ from "underscore";
import { getCardsByIds } from "app/vocabulary/actions/card/functions";
import { getTermsFromCards } from "app/vocabulary/actions/functions/index";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 */
export const withDependencies = (cards) => {
  let card_ids = [];
  // console.log({
  //   j: getTermsFromCards(cards)[0].getSortedCardDependencies(),
  // });
  getTermsFromCards(cards).forEach((term) => {
    term.getSortedCardDependencies().forEach((card) => {
      card_ids.push(card.getId());
    });
  });
  return getCardsByIds(_.uniq(card_ids));
};
