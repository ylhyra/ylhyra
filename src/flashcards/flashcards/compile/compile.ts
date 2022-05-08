import { calculateDependencyGraph } from "flashcards/flashcards/compile/dependencies/dependencyGraph";
import {
  ProcessedDeck,
  RawText,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { log } from "modules/log";
import { rowStore } from "flashcards/flashcards/stores/deck/rowStore";

export const compileDeck = (
  unprocessedDeck: UnprocessedDeck
): ProcessedDeck => {
  const deckProcessed: ProcessedDeck = {
    deckId: unprocessedDeck.deckId,
    cards: {},
    terms: {},
    alternativeIds: {},
    dependenciesUnprocessed: {},
    dependencyGraph: {},
  };

  deckProcessed.dependencyGraph = calculateDependencyGraph(deckProcessed);
  log(deckProcessed);
  return deckProcessed;
};

/**
 * Calculates certain items such as alternativeIds and dependsOn,
 * creates cardIds
 */
export function compileRow(this: rowStore, deckProcessed: ProcessedDeck) {
  // let dependencies: RowIdToRowIds = {};
  // let alternativeIds: RowIdToRowIds = {};
  let dependsOn: RawText[] = [];
  let alternativeIds: RawText[] = [];

  // let termsInThisLine = [this.data.front, ...this.data.front.split(/(?:;+| [-–—] )/g)];
  // addValuesToADependencyGraph(dependencies, termsInThisLine, dependsOn);
  // addValuesToADependencyGraph(alternativeIds, alternativeIds, termsInThisLine);

  /** Register output in deckProcessed */
  cardIds.forEach((cardId) => {
    deckProcessed.cards[cardId] = {
      termId,
    };
  });
  deckProcessed.terms[termId] = {
    cardIds,
  };
}
