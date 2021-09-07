import { log } from "app/app/functions/log";
import _ from "underscore";
import { deck } from "app/vocabulary/actions/deck";
import { sortCardsByScore } from "app/vocabulary/actions/createCards/functions";

export const withDependencies = (card_ids, options = {}) => {
  const { showDepth } = options;
  let returns = [];

  let term_ids = [];
  let depth = {};
  if (typeof card_ids === "string") {
    card_ids = [card_ids];
  }
  card_ids
    .filter((card_id) => card_id in deck.cards)
    .forEach(
      (card_id) => (term_ids = term_ids.concat(deck.cards[card_id].terms))
    );
  term_ids = _.uniq(term_ids);
  term_ids.forEach((term_id) => {
    let terms = [{ term_id, dependencySortKey: 0 }];
    // const chain = CreateDependencyChain(term_id);
    const chain = deck.terms[term_id].dependencies || {};
    // log(
    //   Object.keys(chain).map((j) => {
    //     return [printWord(j), chain[j]];
    //   })
    // );
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
  if (card_ids[1] === "150u9fq_is" && card_ids.length === 1) {
    log(depth);
  }
  const out = _.uniq(returns).filter((card_id) => card_id in deck.cards);
  if (showDepth) {
    let k = {};
    out.forEach((card_id) => {
      k[card_id] = depth[card_id];
    });
    return k;
  } else {
    return out;
  }
};

// /**
//  * Returns an object on the form { [key]: [depth] }
//  */
// const CreateDependencyChain = (
//   from_term_id,
//   _alreadySeen = [],
//   output = [],
//   depth = 1
// ) => {
//   deck.terms[from_term_id]?.dependsOn?.forEach((term_id) => {
//     /* Deep copy in order to only watch direct parents */
//     const alreadySeen = [..._alreadySeen];
//     if (alreadySeen.includes(term_id)) return;
//     alreadySeen.push(term_id);
//     output[term_id] = Math.max(output[term_id] || 0, depth);
//     CreateDependencyChain(term_id, alreadySeen, output, depth + 1);
//   });
//   return output;
// };
