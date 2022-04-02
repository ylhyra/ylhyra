import _ from "underscore";
import { _deck } from "ylhyra/server/vocabulary/compile/index";

export const withDependencies__backend = (cardIds, options?) => {
  const showDepth = options?.showDepth;
  let returns = [];
  let terms = [];
  let depth = {};
  if (typeof cardIds === "string") {
    cardIds = [cardIds];
  }
  cardIds
    .filter((cardId) => cardId in _deck.cards)
    .forEach((cardId) => (terms = terms.concat(_deck.cards[cardId].terms)));
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
          let cardIds = _deck.terms[j].cards;
          // if (cardIds.some((id) => id in deck.schedule)) {
          //   cardIds = _.shuffle(cardIds);
          // } else {
          cardIds = cardIds.sort((a) => {
            if (a.endsWith("is")) return -1;
            return 1;
          });
          // }
          returns = returns.concat(cardIds);
          _deck.terms[j].cards.forEach((cardId) => {
            depth[cardId] = Math.max(depth[cardId] || 0, obj.dependencySortKey);
          });
        }
      });
    });
  });
  const out = _.uniq(returns).filter((cardId) => cardId in _deck.cards);
  if (showDepth) {
    let k = {};
    out.forEach((cardId) => {
      k[cardId] = depth[cardId];
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
