import { Card } from "flashcards/flashcards/actions/card/card";

/** Todo: Limit to only the first few deps */
export function hasDependenciesInCommonWith(card1: Card, card2: Card) {
  const deps1 = [...card1.row.dependencies.dependenciesWithDepth.keys()];
  const deps2 = [...card2.row.dependencies.dependenciesWithDepth.keys()];
  return deps1.some((rowId) => deps2.includes(rowId));
}

export function dependencyDepthOfCard(card1: Card, card2: Card): number {
  return card1.row.dependencies.dependenciesWithDepth.get(card2.row) ?? -1;
}

export function getDependenciesAsArrayOfCards(card1: Card): Card[] {
  /* TODO */
  return card1.row.cards.filter(
    (siblingCard) => siblingCard.cardId !== card1.cardId,
  );
  // throw new Error("Not implemented");
  // return getCardIdsFromRowIds(
  //   Object.keys(cardGetDependenciesAsRowIdToDepth(cardId)) as RowIds
  // ).filter((siblingCard) => siblingCard.cardId !== card1.cardId);
}
