import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DependenciesForAllRowsAsRowIdToDependencyToDepth } from "flashcards/flashcards/types";

/** Prevent ridiculously deep dependencies */
const MAX_DEPTH = 10;

export function getDependencyGraph(
  this: Deck
): DependenciesForAllRowsAsRowIdToDependencyToDepth {
  throw new Error("Not implemented");
  // return warnIfFunctionIsSlow.wrap(() => {
  //   let output: DependenciesForAllRowsAsRowIdToDependencyToDepth = {};
  //
  //   const directDependencies = directDependenciesGraph(this);
  //
  //   keys(directDependencies).forEach((rowId) => {
  //     output[rowId] = dependencyToDepthForASingleRow(directDependencies, rowId);
  //   });
  //   return output;
  // });
}

// /** A rowId to the rowIds it directly depends on */
// export type DirectDependencies = Record<RowId, RowId[]>;
// export function directDependenciesGraph(deck: Deck): DirectDependencies {
//   throw new Error("Not implemented");
//   let directDependencies: DirectDependencies = {};
//   entries(deck.dependenciesUnprocessed).forEach(
//     ([rowId, dependsOnSentences]) => {
//       dependsOnSentences.forEach((dependsOnSentence) => {
//         if (dependsOnSentence in deck.alternativeIds) {
//           directDependencies[rowId] = (directDependencies[rowId] || []).concat(
//             deck.alternativeIds[dependsOnSentence]
//           );
//         }
//       });
//     }
//   );
//   return directDependencies;
// }
//
// /**
//  * Recursively calculates dependencies (if X depends on Y, and Y depends
//  * on Z, then X depends on Y with depth 1 and on Z with depth 2)
//  *
//  * Todo: Remove recursive dependencies before?
//  */
// export const dependencyToDepthForASingleRow = (
//   directDependencies: DirectDependencies,
//   fromRowId: RowId,
//   alreadySeenDirectParents: RowIds = [],
//   output: DependenciesForOneRowAsDependencyToDepth = {},
//   depth = 1
// ): DependenciesForOneRowAsDependencyToDepth => {
//   if (depth > MAX_DEPTH) return output;
//   directDependencies[fromRowId].forEach((toRowId) => {
//     if (alreadySeenDirectParents.includes(toRowId)) return;
//
//     output[toRowId] = Math.max(output[toRowId] || 0, depth);
//     dependencyToDepthForASingleRow(
//       directDependencies,
//       toRowId,
//       /* Deep copy in order to only watch direct parents */
//       [...alreadySeenDirectParents, toRowId],
//       output,
//       depth + 1
//     );
//   });
//   return output;
// };
