import { Card } from "flashcards/flashcards/actions/card/card";
import {
  getCardIdsFromRowId,
  getCardIdsFromRowIds,
  getCardIdsShuffledIfSeen,
} from "flashcards/flashcards/actions/card/row";
import { getRowIdFromCardId } from "flashcards/flashcards/actions/deck/compile/ids";
import { RowId, RowIds } from "flashcards/flashcards/types/rowData";
import {
  CardId,
  CardIds,
  DependenciesForOneRowAsDependencyToDepth,
} from "flashcards/flashcards/types/types";
import _ from "underscore";

export function cardGetDependenciesAsRowIdToDepth(
  this: Card
): DependenciesForOneRowAsDependencyToDepth {
  const rowId: RowId = getRowIdFromCardId(id);
  return rowGetDependenciesAsRowIdToDepth(rowId);
}

/**
 * Note: Also includes itself as depth=0. I don't remember if this is used.
 */
export const rowGetDependenciesAsRowIdToDepth = (
  rowId: RowId
): DependenciesForOneRowAsDependencyToDepth => {
  throw new Error("Not implemented");
  // return {
  //   ...(getProcessedDeckById(getDeckId(rowId))?.dependencyGraph[rowId] || {}),
  //   [rowId]: 0,
  // };
};

export function getDependenciesAsCardIdToDepth(this: Card) {
  let out: Record<CardId, number> = {};
  const deps = this.cardGetDependenciesAsRowIdToDepth();
  (Object.keys(deps) as RowIds).forEach((rowId) => {
    getCardIdsFromRowId(rowId).forEach((cardId) => {
      out[cardId] = deps[rowId];
    });
  });
  return out;
}

export function getDependenciesAsArrayOfCardIds(this: Card): CardIds {
  return getCardIdsFromRowIds(
    Object.keys(cardGetDependenciesAsRowIdToDepth(cardId)) as RowIds
  ).filter((siblingCardId) => siblingCardId !== cardId);
}

export function dependencyDepthOfCard(this: Card, card2: Card): number {
  return this.getDependenciesAsCardIdToDepth()[card2.cardId];
}

export function hasDependenciesInCommonWith(this: Card, card2: Card) {
  const deps1 = this.getDependenciesAsArrayOfCardIds();
  const deps2 = card2.getDependenciesAsArrayOfCardIds();
  return deps1.some((cardId) => deps2.includes(cardId));
}

export const getSortedRowDependencies = (rowId: RowId): RowIds => {
  const dependenciesAsRowIdToDepth = rowGetDependenciesAsRowIdToDepth(rowId);
  let rowIds = (Object.keys(dependenciesAsRowIdToDepth) as RowIds).sort(
    (a, b) => dependenciesAsRowIdToDepth[b] - dependenciesAsRowIdToDepth[a]
  );
  // if (options?.onlyDirect) {
  //   rowIds = rowIds.filter((a) => dependenciesAsRowIdToDepth[a] <= 1);
  // }
  return rowIds;
};

export const getSortedCardDependenciesAsCardIds = (rowId: RowId) => {
  return _.uniq(
    _.flatten(
      getSortedRowDependencies(rowId).map((row) =>
        getCardIdsShuffledIfSeen(row)
      )
    )
  );
};
