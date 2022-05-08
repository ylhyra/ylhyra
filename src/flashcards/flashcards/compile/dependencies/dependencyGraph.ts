import {
  DependenciesForAllTermsAsTermIdToDependencyToDepth,
  DependenciesForOneTermAsDependencyToDepth,
  ProcessedDeck,
  TermId,
  TermIds,
} from "flashcards/flashcards/types/types";
import { entries, keys } from "modules/typescript/objectEntries";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";
import { deckStore } from "flashcards/flashcards/stores/deck/deckStore";

/**
 * Prevent ridiculously deep dependencies
 */
const MAX_DEPTH = 10;

export function getDependencyGraph(
  this: deckStore
): DependenciesForAllTermsAsTermIdToDependencyToDepth {
  return warnIfFunctionIsSlow(() => {
    let output: DependenciesForAllTermsAsTermIdToDependencyToDepth = {};

    const directDependencies = directDependenciesGraph(deck);

    keys(directDependencies).forEach((termId) => {
      output[termId] = dependencyToDepthForASingleTerm(
        directDependencies,
        termId
      );
    });
    return output;
  });
}

/**
 * A termId to the termIds it directly depends on
 */
export type DirectDependencies = Record<TermId, TermId[]>;
export const directDependenciesGraph = (
  deck: ProcessedDeck
): DirectDependencies => {
  let directDependencies: DirectDependencies = {};
  entries(deck.dependenciesUnprocessed).forEach(
    ([termId, dependsOnSentences]) => {
      dependsOnSentences.forEach((dependsOnSentence) => {
        if (dependsOnSentence in deck.alternativeIds) {
          directDependencies[termId] = (
            directDependencies[termId] || []
          ).concat(deck.alternativeIds[dependsOnSentence]);
        }
      });
    }
  );
  return directDependencies;
};

/**
 * Recursively calculates dependencies
 * (if X depends on Y, and Y depends on Z,
 * then X depends on Y with depth 1 and on Z with depth 2)
 *
 * Todo: Remove recursive dependencies before?
 */
export const dependencyToDepthForASingleTerm = (
  directDependencies: DirectDependencies,
  fromTermId: TermId,
  alreadySeenDirectParents: TermIds = [],
  output: DependenciesForOneTermAsDependencyToDepth = {},
  depth = 1
): DependenciesForOneTermAsDependencyToDepth => {
  if (depth > MAX_DEPTH) return output;
  directDependencies[fromTermId].forEach((toTermId) => {
    if (alreadySeenDirectParents.includes(toTermId)) return;

    output[toTermId] = Math.max(output[toTermId] || 0, depth);
    dependencyToDepthForASingleTerm(
      directDependencies,
      toTermId,
      /* Deep copy in order to only watch direct parents */
      [...alreadySeenDirectParents, toTermId],
      output,
      depth + 1
    );
  });
  return output;
};

/**
 * Todo:
 * In this previous version, it was necessary to clean up the dependency graph
 * as it sometimes skipped. Please verify that this is no longer necessary,
 * I think it is not since I created the directDependenciesGraph first now.
 */
// export const temp = () => {
//   (Object.keys(deck!.terms) as TermIds).forEach((termId: TermId) => {
//     const deps: DependenciesForOneTermAsDependencyToDepth =
//       dependencyToDepthForASingleTerm(deck, termId);
//
//     /* The chain above isn't perfect and sometimes skips over values */
//     let lowestDep = Infinity;
//     (Object.keys(deps) as TermIds).forEach((dep) => {
//       lowestDep = Math.min(lowestDep, deps[dep]);
//     });
//     (Object.keys(deps) as TermIds).forEach((dep) => {
//       deps[dep] -= lowestDep - 1;
//     });
//
//     if (Object.keys(deps).length > 0) {
//       deck!.terms[termId].dependencies = deps;
//     }
//     if (Object.keys(deps).length > 30) {
//       console.log(`very long deps for ${printWord(termId)}`);
//       (Object.keys(deps) as TermIds).forEach((j) => {
//         console.log({ word: printWord(j), level: deps[j] });
//       });
//     }
//   });
// };

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
