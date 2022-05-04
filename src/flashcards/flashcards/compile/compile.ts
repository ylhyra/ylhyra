import { addValuesToADependencyGraph } from "flashcards/flashcards/compile/dependencyGraph";
import { CardEntry } from "flashcards/flashcards/types/cardEntry";
import {
  RowIdToRowIds,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";

export const compileDeck = (deck: UnprocessedDeck) => {};

/**
 * Calculates certain items such as alternativeIds and dependsOn
 */
export const compileRow = (row: CardEntry) => {
  if (!row.front || !row.back) return null;

  let dependencies: RowIdToRowIds = {};
  let alternativeIds: RowIdToRowIds = {};

  // let termsInThisLine = [row.front, ...row.front.split(/(?:;+| [-–—] )/g)];
  //
  // addValuesToADependencyGraph(dependencies, termsInThisLine, dependsOn);
  // addValuesToADependencyGraph(alternativeIds, alternativeIds, termsInThisLine);
};
