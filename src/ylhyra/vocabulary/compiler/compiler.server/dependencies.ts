import _ from "underscore";
import { getCardData } from "ylhyra/vocabulary/app/actions/card/card_data";
import {
  CardId,
  CardIds,
  CardIdToDependencyDepth,
  DeckDatabaseInCompilationStep,
  TermId,
  TermIds,
  TermIdToDependencyDepth,
} from "ylhyra/vocabulary/types";

/**
 * Returns an array of card ids sorted in such a way that
 * dependencies (cards that the user must have studied before
 * seeing a card) always come before the card that depends on it.
 */
export const sortDependenciesBeforeCardsThatDependOnThem = (
  deck: DeckDatabaseInCompilationStep,
  cardIds: CardIds
): CardIds => {
  let returns: CardIds = [];
  let termIds: TermIds = [];
  let cardIdToDepth: CardIdToDependencyDepth = {};
  if (typeof cardIds === "string") {
    cardIds = [cardIds];
  }
  cardIds
    .filter((cardId) => cardId in deck!.cards)
    .forEach((cardId) => {
      termIds = termIds.concat(getCardData(cardId, "terms"));
    });
  termIds = _.uniq(termIds);
  termIds.forEach((termId) => {
    let termsWithDependencySortKey = [{ term: termId, dependencySortKey: 0 }];
    const chain = createDependencyChainBackend(deck, termId);
    Object.keys(chain).forEach((termId) => {
      termsWithDependencySortKey.push({
        term: termId as TermId,
        dependencySortKey: chain[termId as TermId],
      });
    });
    termsWithDependencySortKey = termsWithDependencySortKey.sort(
      (a, b) => b.dependencySortKey - a.dependencySortKey
    );
    termsWithDependencySortKey.forEach((obj) => {
      termId = obj.term;
      [termId, ...(deck!.alternativeIds[termId] || [])].forEach((j) => {
        if (j in deck!.terms) {
          let cardIds = deck!.terms[j].cards;
          cardIds = cardIds.sort((a) => {
            if (a.endsWith("is")) return -1;
            return 1;
          });
          returns = returns.concat(cardIds);
          deck!.terms[j].cards.forEach((cardId) => {
            cardIdToDepth[cardId as CardId] = Math.max(
              cardIdToDepth[cardId as CardId] || 0,
              obj.dependencySortKey
            );
          });
        }
      });
    });
  });
  const out = _.uniq(returns).filter((cardId) => cardId in deck!.cards);
  return out;
};

/**
 * Returns an object on the form { [key]: [depth] }
 */
export const createDependencyChainBackend = (
  deck: DeckDatabaseInCompilationStep,
  fromTerm: TermId,
  _alreadySeenDirectParents: TermIds = [],
  output: TermIdToDependencyDepth = {},
  depth = 1
): TermIdToDependencyDepth => {
  if (fromTerm in deck!.dependencies) {
    deck!.dependencies[fromTerm].forEach((term) => {
      if (!term) return;
      /* Deep copy in order to only watch direct parents */
      const alreadySeenDirectParents: TermIds = [..._alreadySeenDirectParents];
      if (alreadySeenDirectParents.includes(term)) {
        return;
      }
      alreadySeenDirectParents.push(term);

      output[term] = Math.max(output[term] || 0, depth);
      [
        term,
        /* Through alternative ids */
        ...(deck!.alternativeIds[term] || []),
      ]
        .filter(Boolean)
        .forEach((j) => {
          const isThroughAltId = j !== term;
          createDependencyChainBackend(
            deck,
            j,
            alreadySeenDirectParents,
            output,
            depth + (isThroughAltId ? 0 : 1)
          );
        });
    });
  }
  return output;
};
