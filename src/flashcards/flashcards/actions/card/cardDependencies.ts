import { Card } from "flashcards/flashcards/actions/card/card";

/**
 * Todo: Limit to only the first few deps
 */
export function hasDependenciesInCommonWith(this: Card, card2: Card) {
  const deps1 = this.row.getDependenciesAsArrayOfRowIds();
  const deps2 = card2.row.getDependenciesAsArrayOfRowIds();
  return deps1.some((rowId) => deps2.includes(rowId));
}

export function dependencyDepthOfCard(this: Card, card2: Card): number {
  return this.row.getDependencies()[card2.rowId];
}

export function getDependenciesAsArrayOfCards(this: Card): Card[] {
  throw new Error("Not implemented");
  // return getCardIdsFromRowIds(
  //   Object.keys(cardGetDependenciesAsRowIdToDepth(cardId)) as RowIds
  // ).filter((siblingCard) => siblingCard.cardId !== this.cardId);
}
