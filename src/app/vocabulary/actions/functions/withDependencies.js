import _ from "underscore";
import { deck } from "app/vocabulary/actions/deck";
import { sortCardsByScore } from "app/vocabulary/actions/createCards/functions";
import { getCardsByIds } from "app/vocabulary/actions/card/functions";
import { getTermsFromCards } from "app/vocabulary/actions/functions/index";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 */
export const withDependencies = (cards) => {
  let returns = [];
  getTermsFromCards(cards).forEach((term) => {
    term.getDependenciesAsCardIdToDepth;

    let terms = [{ term_id, temporaryDependencySortKey: 0 }];
    const chain = term.dependencies || {};
    Object.keys(chain).forEach((k) => {
      terms.push({ term_id: k, temporaryDependencySortKey: chain[k] });
    });
    terms = terms.sort(
      (a, b) => b.temporaryDependencySortKey - a.temporaryDependencySortKey
    );
    terms.forEach((obj) => {
      const term_id2 = obj.term_id;
      if (!deck.terms[term_id2]) return;
      let card_ids = deck.terms[term_id2].cards;
      if (deck.schedule && card_ids.some((id) => id in deck.schedule)) {
        // card_ids = _.shuffle(card_ids);
        card_ids = sortCardsByScore(card_ids);
      } else {
        card_ids = card_ids.sort((a) => {
          if (a.endsWith("is")) return -1;
          return 1;
        });
      }
      returns = returns.concat(card_ids);
      // deck.terms[term_id2].cards.forEach((card_id) => {
      //   depth[card_id] = Math.max(
      //     depth[card_id] || 0,
      //     obj.temporaryDependencySortKey
      //   );
      // });
    });
  });
  return getCardsByIds(_.uniq(returns));
};
