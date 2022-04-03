import _ from "underscore";
import {
  CardIds,
  TermId,
  TermIds,
} from "ylhyra/app/vocabulary/actions/card/types";
import {
  BackendDeck,
  TermIdToDependencyDepth,
} from "ylhyra/maker/vocabulary_maker/compile/parse_vocabulary_file";

export const withDependenciesBackend = (
  deck: BackendDeck,
  cardIds: CardIds
): CardIds => {
  let returns: CardIds = [];
  let termIds: TermIds = [];
  let depth: TermIdToDependencyDepth = {};
  if (typeof cardIds === "string") {
    cardIds = [cardIds];
  }
  cardIds
    .filter((cardId) => cardId in deck.cards)
    .forEach((cardId) => (termIds = termIds.concat(deck.cards[cardId].terms)));
  termIds = _.uniq(termIds);
  termIds.forEach((termId) => {
    let termsWithDependencySortKey = [{ term: termId, dependencySortKey: 0 }];
    const chain = createDependencyChainBackend(deck, termId);
    Object.keys(chain).forEach((k: TermId) => {
      termsWithDependencySortKey.push({ term: k, dependencySortKey: chain[k] });
    });
    termsWithDependencySortKey = termsWithDependencySortKey.sort(
      (a, b) => b.dependencySortKey - a.dependencySortKey
    );
    termsWithDependencySortKey.forEach((obj) => {
      termId = obj.term;
      [termId, ...(deck.alternativeIds[termId] || [])].forEach((j) => {
        if (j in deck.terms) {
          let cardIds = deck.terms[j].cards;
          cardIds = cardIds.sort((a) => {
            if (a.endsWith("is")) return -1;
            return 1;
          });
          returns = returns.concat(cardIds);
          deck.terms[j].cards.forEach((cardId) => {
            depth[cardId] = Math.max(depth[cardId] || 0, obj.dependencySortKey);
          });
        }
      });
    });
  });
  const out = _.uniq(returns).filter((cardId) => cardId in deck.cards);
  // if (showDepth) {
  //   let k = {};
  //   out.forEach((cardId) => {
  //     k[cardId] = depth[cardId];
  //   });
  //   return k;
  // }
  return out;
};

/**
 * Returns an object on the form { [key]: [depth] }
 */
export const createDependencyChainBackend = (
  deck: BackendDeck,
  fromTerm: TermId,
  _alreadySeenDirectParents = [],
  output: TermIdToDependencyDepth = {},
  depth = 1,
  type = "deep" // or "shallow"
): TermIdToDependencyDepth => {
  if (fromTerm in deck.dependencies) {
    deck.dependencies[fromTerm].forEach((term) => {
      if (!term) return;
      /* Deep copy in order to only watch direct parents */
      const alreadySeenDirectParents = [..._alreadySeenDirectParents];
      if (alreadySeenDirectParents.includes(term)) {
        return;
      }
      alreadySeenDirectParents.push(term);

      if (type === "shallow") {
        output[term] = Math.min(output[term] || 100, depth);
      } else if (type === "deep") {
        output[term] = Math.max(output[term] || 0, depth);
      }
      [
        term,
        /* Through alternative ids */
        ...(deck.alternativeIds[term] || []),
      ]
        .filter(Boolean)
        .forEach((j) => {
          const isThroughAltId = j !== term;
          createDependencyChainBackend(
            deck,
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
