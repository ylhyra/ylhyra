import _ from "underscore";
import { deck } from "app/vocabulary/actions/deck";
import { sortCardsByScore } from "app/vocabulary/actions/createCards/functions";
import { getCardsByIds } from "app/vocabulary/actions/card/functions";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 */
export const withDependencies = (cards) => {
  let returns = [];
  let term_ids = [];
  let depth = {};
  cards.forEach((card) => (term_ids = term_ids.concat(card.getTermIds())));
  term_ids = _.uniq(term_ids);
  term_ids.forEach((term_id) => {
    let terms = [{ term_id, dependencySortKey: 0 }];
    const chain = deck.terms[term_id].dependencies || {};
    Object.keys(chain).forEach((k) => {
      terms.push({ term_id: k, dependencySortKey: chain[k] });
    });
    terms = terms.sort((a, b) => b.dependencySortKey - a.dependencySortKey); //.map((i) => i.term_id);
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
      deck.terms[term_id2].cards.forEach((card_id) => {
        depth[card_id] = Math.max(depth[card_id] || 0, obj.dependencySortKey);
      });
    });
  });
  return getCardsByIds(_.uniq(returns));
};
