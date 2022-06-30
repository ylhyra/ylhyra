import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { RowId, RowIds } from "flashcards/flashcards/actions/row/rowData.types";
import {
  DependenciesForAllRowsAsRowIdToDependencyToDepth,
  DependenciesForOneRowAsDependencyToDepth,
} from "flashcards/flashcards/types";
import { keys } from "modules/typescript/objectEntries";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

/** Prevent ridiculously deep dependencies */
const MAX_DEPTH = 10;

export function getDependencyGraph(
  this: Deck
): DependenciesForAllRowsAsRowIdToDependencyToDepth {
  return warnIfFunctionIsSlow.wrap(() => {
    let output: DependenciesForAllRowsAsRowIdToDependencyToDepth = {};

    const rowRedirects = this.rowRedirects;
    const directDependencies = getDirectDependencies(this, rowRedirects);

    keys(directDependencies).forEach((rowId) => {
      output[rowId] = dependencyToDepthForASingleRow(directDependencies, rowId);
    });
    return output;
  });
}

/** A rowId to the rowIds it directly depends on */
export type DirectDependencies = Record<RowId, RowId[]>;
export function getDirectDependencies(
  deck: Deck,
  rowRedirects: Record<string, RowId>
): DirectDependencies {
  let directDependencies: DirectDependencies = {};

  for (const row of deck.rows) {
    for (const dependency of row.dependsOn) {
      if (dependency in rowRedirects) {
        directDependencies[row.rowId] = (
          directDependencies[row.rowId] || []
        ).concat(rowRedirects[dependency]);
      }
    }
  }

  return directDependencies;
}

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
