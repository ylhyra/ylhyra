import { RawText } from "flashcards/flashcards/types/types";
import { deckStore } from "flashcards/flashcards/stores/deck/deckStore";
import { rowStore } from "flashcards/flashcards/stores/deck/rowStore";

/**
 * Calculates certain items such as alternativeIds and dependsOn,
 * creates cardIds
 */
export function compileRow(this: rowStore, deckProcessed: deckStore) {
  // let dependencies: RowIdToRowIds = {};
  // let alternativeIds: RowIdToRowIds = {};
  let dependsOn: RawText[] = [];
  let alternativeIds: RawText[] = [];

  // let termsInThisLine = [this.data.front, ...this.data.front.split(/(?:;+| [-–—] )/g)];
  // addValuesToADependencyGraph(dependencies, termsInThisLine, dependsOn);
  // addValuesToADependencyGraph(alternativeIds, alternativeIds, termsInThisLine);
  // deckProcessed.terms[termId] = {
  //   cardIds,
  // };
}
