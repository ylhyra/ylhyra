import { Card } from "flashcards/flashcards/actions/card/card";

/** Todo: Limit to only the first few deps */
export function hasDependenciesInCommonWith(card1: Card, card2: Card) {
  const deps1 = card1.row.getDependenciesAsArrayOfRowIds();
  const deps2 = card2.row.getDependenciesAsArrayOfRowIds();
  return deps1.some((rowId) => deps2.includes(rowId));
}

export function dependencyDepthOfCard(card1: Card, card2: Card): number {
  return card1.row.dependencies[card2.rowId];
}

export function getDependenciesAsArrayOfCards(card1: Card): Card[] {
  return [];
  // throw new Error("Not implemented");
  // return getCardIdsFromRowIds(
  //   Object.keys(cardGetDependenciesAsRowIdToDepth(cardId)) as RowIds
  // ).filter((siblingCard) => siblingCard.cardId !== card1.cardId);
}
