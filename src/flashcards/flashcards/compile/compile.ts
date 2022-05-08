import { calculateDependencyGraph } from "flashcards/flashcards/compile/dependencies/dependencyGraph";
import {
  shouldCreateBackToFront,
  shouldCreateFrontToBack,
} from "flashcards/flashcards/compile/functions";
import { createCardId, createTermId } from "flashcards/flashcards/compile/ids";
import { Row } from "flashcards/flashcards/types/row";
import {
  CardIds,
  Direction,
  ProcessedDeck,
  RawText,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { log } from "modules/log";
import { entries } from "modules/typescript/objectEntries";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

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
  // log(deck);
  warnIfFunctionIsSlow(() => {
    entries(unprocessedDeck.rows).forEach(([, row]) => {
      compileRow(row, deckProcessed);
    });
  });

  deckProcessed.dependencyGraph = calculateDependencyGraph(deckProcessed);
  log(deckProcessed);
  return deckProcessed;
};

/**
 * Calculates certain items such as alternativeIds and dependsOn,
 * creates cardIds
 */
export const compileRow = (row: Row, deckProcessed: ProcessedDeck) => {
  if (!row.front || !row.back) return null;

  // let dependencies: RowIdToRowIds = {};
  // let alternativeIds: RowIdToRowIds = {};
  let dependsOn: RawText[] = [];
  let alternativeIds: RawText[] = [];
  let cardIds: CardIds = [];
  /** TODO find better naming */
  const termId = createTermId(deckProcessed.deckId, row.rowId);

  // let termsInThisLine = [row.front, ...row.front.split(/(?:;+| [-–—] )/g)];
  //
  // addValuesToADependencyGraph(dependencies, termsInThisLine, dependsOn);
  // addValuesToADependencyGraph(alternativeIds, alternativeIds, termsInThisLine);

  if (shouldCreateFrontToBack(row)) {
    cardIds.push(createCardId(termId, Direction.FRONT_TO_BACK));
  }
  if (shouldCreateBackToFront(row)) {
    cardIds.push(createCardId(termId, Direction.BACK_TO_FRONT));
  }

  /** Register output in deckProcessed */
  cardIds.forEach((cardId) => {
    deckProcessed.cards[cardId] = {
      termId,
    };
  });
  deckProcessed.terms[termId] = {
    cardIds,
  };
};
