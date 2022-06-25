import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { RowId, RowIds } from "flashcards/flashcards/actions/row/rowData.types";
import {
  DependenciesForAllRowsAsRowIdToDependencyToDepth,
  DependenciesForOneRowAsDependencyToDepth,
} from "flashcards/flashcards/types";

/** Prevent ridiculously deep dependencies */
const MAX_DEPTH = 10;

export function getDependencyGraph(
  this: Deck
): DependenciesForAllRowsAsRowIdToDependencyToDepth {
  throw new Error("Not implemented");

  // return warnIfFunctionIsSlow.wrap(() => {
  //   let output: DependenciesForAllRowsAsRowIdToDependencyToDepth = {};
  //
  //   const directDependencies = directDependenciesGraph(deck);
  //
  //   keys(directDependencies).forEach((rowId) => {
  //     output[rowId] = dependencyToDepthForASingleRow(
  //       directDependencies,
  //       rowId
  //     );
  //   });
  //   return output;
  // });
}

/** A rowId to the rowIds it directly depends on */
export type DirectDependencies = Record<RowId, RowId[]>;
export const directDependenciesGraph = (deck: Deck): DirectDependencies => {
  throw new Error("Not implemented");
  // let directDependencies: DirectDependencies = {};
  // entries(deck.dependenciesUnprocessed).forEach(
  //   ([rowId, dependsOnSentences]) => {
  //     dependsOnSentences.forEach((dependsOnSentence) => {
  //       if (dependsOnSentence in deck.alternativeIds) {
  //         directDependencies[rowId] = (
  //           directDependencies[rowId] || []
  //         ).concat(deck.alternativeIds[dependsOnSentence]);
  //       }
  //     });
  //   }
  // );
  // return directDependencies;
};

/**
 * Recursively calculates dependencies (if X depends on Y, and Y depends
 * on Z, then X depends on Y with depth 1 and on Z with depth 2)
 *
 * Todo: Remove recursive dependencies before?
 */
export const dependencyToDepthForASingleRow = (
  directDependencies: DirectDependencies,
  fromRowId: RowId,
  alreadySeenDirectParents: RowIds = [],
  output: DependenciesForOneRowAsDependencyToDepth = {},
  depth = 1
): DependenciesForOneRowAsDependencyToDepth => {
  if (depth > MAX_DEPTH) return output;
  directDependencies[fromRowId].forEach((toRowId) => {
    if (alreadySeenDirectParents.includes(toRowId)) return;

    output[toRowId] = Math.max(output[toRowId] || 0, depth);
    dependencyToDepthForASingleRow(
      directDependencies,
      toRowId,
      /* Deep copy in order to only watch direct parents */
      [...alreadySeenDirectParents, toRowId],
      output,
      depth + 1
    );
  });
  return output;
};

/**
 * Todo:
 * In this previous version, it was necessary to clean up the dependency graph
 * as it sometimes skipped. Please verify that this is no longer necessary, I
 * think it is not since I created the directDependenciesGraph first now.
 */
// export const temp = () => {
//   (Object.keys(deck!.rows) as RowIds).forEach((rowId: RowId) => {
//     const deps: DependenciesForOneRowAsDependencyToDepth =
//       dependencyToDepthForASingleRow(deck, rowId);
//
//     /* The chain above isn't perfect and sometimes skips over values */
//     let lowestDep = Infinity;
//     (Object.keys(deps) as RowIds).forEach((dep) => {
//       lowestDep = Math.min(lowestDep, deps[dep]);
//     });
//     (Object.keys(deps) as RowIds).forEach((dep) => {
//       deps[dep] -= lowestDep - 1;
//     });
//
//     if (Object.keys(deps).length > 0) {
//       deck!.rows[rowId].dependencies = deps;
//     }
//     if (Object.keys(deps).length > 30) {
//       console.log(`very long deps for ${printWord(rowId)}`);
//       (Object.keys(deps) as RowIds).forEach((j) => {
//         console.log({ word: printWord(j), level: deps[j] });
//       });
//     }
//   });
// };

// import _ from "underscore";
//
// export function addValuesToADependencyGraph (
//   input: Record<string, string[]>,
//   /** These will become keys */
//   first: string[],
//   /** These will become values for each of the above keys */
//   second: string[]
// ) {
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
