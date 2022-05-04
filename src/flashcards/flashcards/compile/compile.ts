import { Row, RowIdToRowIds } from "flashcards/flashcards/types/row";
import { UnprocessedDeck } from "flashcards/flashcards/types/types";

export const compileDeck = (deck: UnprocessedDeck) => {
  return deck;
};

/**
 * Calculates certain items such as alternativeIds and dependsOn
 */
export const compileRow = (row: Row) => {
  if (!row.front || !row.back) return null;

  let dependencies: RowIdToRowIds = {};
  let alternativeIds: RowIdToRowIds = {};

  // let termsInThisLine = [row.front, ...row.front.split(/(?:;+| [-–—] )/g)];
  //
  // addValuesToADependencyGraph(dependencies, termsInThisLine, dependsOn);
  // addValuesToADependencyGraph(alternativeIds, alternativeIds, termsInThisLine);
};
