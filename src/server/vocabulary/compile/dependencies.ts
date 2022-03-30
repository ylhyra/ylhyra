import { _deck } from "server/vocabulary/compile/index";
import _ from "underscore";

export const withDependencies__backend = (card_ids, options?) => {
  const showDepth = options?.showDepth;
  let returns = [];
  let terms = [];
  let depth = {};
  if (typeof card_ids === "string") {
    card_ids = [card_ids];
  }
  card_ids
    .filter((card_id) => card_id in _deck.cards)
    .forEach((card_id) => (terms = terms.concat(_deck.cards[card_id].terms)));
  terms = _.uniq(terms);
  terms.forEach((term) => {
    let terms = [{ term, dependencySortKey: 0 }];
    const chain = CreateDependencyChain__backend(term);
    // console.log(
    //   Object.keys(chain).map((j) => {
    //     return [printWord(j), chain[j]];
    //   })
    // );
    Object.keys(chain).forEach((k) => {
      terms.push({ term: k, dependencySortKey: chain[k] });
    });
    terms = terms.sort((a, b) => b.dependencySortKey - a.dependencySortKey); //.map((i) => i.term);
    terms.forEach((obj) => {
      term = obj.term;
      [term, ...(_deck.alternative_ids[term] || [])].forEach((j) => {
        if (j in _deck.terms) {
          let card_ids = _deck.terms[j].cards;
          // if (card_ids.some((id) => id in deck.schedule)) {
          //   card_ids = _.shuffle(card_ids);
          // } else {
          card_ids = card_ids.sort((a) => {
            if (a.endsWith("is")) return -1;
            return 1;
          });
          // }
          returns = returns.concat(card_ids);
          _deck.terms[j].cards.forEach((card_id) => {
            depth[card_id] = Math.max(
              depth[card_id] || 0,
              obj.dependencySortKey
            );
          });
        }
      });
    });
  });
  const out = _.uniq(returns).filter((card_id) => card_id in _deck.cards);
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
/**
 * Returns an object on the form { [key]: [depth] }
 */
export const CreateDependencyChain__backend = (
  from_term,
  _alreadySeenDirectParents = [],
  output = {},
  depth = 1,
  type = "deep" // or "shallow"
) => {
  if (from_term in _deck.dependencies) {
    _deck.dependencies[from_term].forEach((term) => {
      if (!term) return;
      /* Deep copy in order to only watch direct parents */
      const alreadySeenDirectParents = [..._alreadySeenDirectParents];
      if (alreadySeenDirectParents.includes(term)) {
        // DeleteDependency(from_term, term);
        return;
      }
      alreadySeenDirectParents.push(term);

      // if (from_term === "1ydhbm") {
      //   console.log({
      //     depth,
      //     output,
      //     term,
      //   });
      // }
      if (type === "shallow") {
        output[term] = Math.min(output[term] || 100, depth);
      } else if (type === "deep") {
        output[term] = Math.max(output[term] || 0, depth);
      }
      [
        term,
        /* Through alternative ids */
        ...(_deck.alternative_ids[term] || []),
      ]
        .filter(Boolean)
        .forEach((j) => {
          const isThroughAltId = j !== term;
          CreateDependencyChain__backend(
            j,
            alreadySeenDirectParents,
            output,
            depth + (isThroughAltId ? 0 : 1),
            type
          );
        });
    });
  }
  return output;
};
