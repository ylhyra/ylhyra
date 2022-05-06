// import _ from "underscore";
//
// export const addValuesToADependencyGraph = (
//   input: Record<string, string[]>,
//   /** These will become keys */
//   first: string[],
//   /** These will become values for each of the above keys */
//   second: string[]
// ) => {
//   if (!second || second.length === 0) return;
//   first.forEach((key) => {
//     input[key] = _.uniq([...(input[key] || []), ...second]).filter(
//       (j) => j !== key
//     );
//     if (input[key].length === 0) {
//       delete input[key];
//     }
//   });
// };

import {
  DeckProcessed,
  TermId,
  TermIds,
  TermIdToDependencyDepth,
} from "flashcards/flashcards/types/types";
import { printWord } from "flashcards/flashcards/actions/functions";
import { entries } from "modules/typescript/objectEntries";

export const calculateDependencyGraph = (
  deck: DeckProcessed
): TermIdToDependencyDepth => {
  let output: TermIdToDependencyDepth = {};

  /**
   * Start by calculating a shallow graph (only termId to the termIds it directly depends on)
   */
  entries(deck.dependenciesUnprocessed).forEach(([termId, dependsOn]) => {});

  return output;
};

export const temp = () => {
  (Object.keys(deck!.terms) as TermIds).forEach((termId: TermId) => {
    const deps: TermIdToDependencyDepth = createDependencyChainBackend(
      deck,
      termId
    );

    /* The chain above isn't perfect and sometimes skips over values */
    let lowestDep = Infinity;
    (Object.keys(deps) as TermIds).forEach((dep) => {
      lowestDep = Math.min(lowestDep, deps[dep]);
    });
    (Object.keys(deps) as TermIds).forEach((dep) => {
      deps[dep] -= lowestDep - 1;
    });

    if (Object.keys(deps).length > 0) {
      deck!.terms[termId].dependencies = deps;
    }
    if (Object.keys(deps).length > 30) {
      console.log(`very long deps for ${printWord(termId)}`);
      (Object.keys(deps) as TermIds).forEach((j) => {
        console.log({ word: printWord(j), level: deps[j] });
      });
    }
  });
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
