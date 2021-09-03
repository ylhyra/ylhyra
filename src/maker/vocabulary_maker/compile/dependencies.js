export let deck;
export function sortObject(obj, sortKey, replace) {
  let out = {};
  Object.keys(obj)
    .sort((a, b) => obj[a][sortKey] - obj[b][sortKey])
    .forEach((k, index) => {
      out[k] = obj[k];
      if (replace) {
        out[k][sortKey] = index + 1;
      }
    });
  return out;
}

export const withDependencies__backend = (card_ids, options) => {
  const showDepth = options?.showDepth;
  let returns = [];
  let terms = [];
  let depth = {};
  if (typeof card_ids === "string") {
    card_ids = [card_ids];
  }
  card_ids
    .filter((card_id) => card_id in deck.cards)
    .forEach((card_id) => (terms = terms.concat(deck.cards[card_id].terms)));
  terms = _.uniq(terms);
  terms.forEach((term) => {
    let terms = [{ term, dependencySortKey: 0 }];
    const chain = CreateDependencyChain__backend(term, deck);
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
      [term, ...(deck.alternative_ids[term] || [])].forEach((j) => {
        if (j in deck.terms) {
          let card_ids = deck.terms[j].cards;
          card_ids = card_ids.sort((a) => {
            if (a.endsWith("is")) return -1;
            return 1;
          });
          returns = returns.concat(card_ids);
          deck.terms[j].cards.forEach((card_id) => {
            depth[card_id] = Math.max(
              depth[card_id] || 0,
              obj.dependencySortKey
            );
          });
        }
      });
    });
  });
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

/**
 * Returns an object on the form { [key]: [depth] }
 */
export const CreateDependencyChain__backend = (
  from_term,
  deck,
  _alreadySeen = [],
  output = [],
  depth = 1
) => {
  if (depth === 1) {
    _alreadySeen.push(from_term);
  }
  if (from_term in deck.dependencies) {
    deck.dependencies[from_term].forEach((term) => {
      /* Deep copy in order to only watch direct parents */
      const alreadySeen = [..._alreadySeen];
      if (alreadySeen.includes(term)) return;
      alreadySeen.push(term);
      output[term] = Math.max(output[term] || 0, depth);
      // output[term] = Math.min(output[term] || 100, depth);
      [
        term,
        /* Through alternative ids */
        ...(deck.alternative_ids[term] || []).filter(
          (j) => !alreadySeen.includes(j)
        ),
      ]
        .filter(Boolean)
        .forEach((j) => {
          const isThroughAltId = j !== term;
          CreateDependencyChain__backend(
            j,
            deck,
            alreadySeen,
            output,
            depth + (isThroughAltId ? 0 : 1)
          );
        });
    });
  }
  return output;
};
