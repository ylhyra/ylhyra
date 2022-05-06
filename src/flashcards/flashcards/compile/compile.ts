import {
  shouldCreateBackToFront,
  shouldCreateFrontToBack,
} from "flashcards/flashcards/compile/functions";
import { createCardId, createTermId } from "flashcards/flashcards/compile/ids";
import { Row } from "flashcards/flashcards/types/row";
import {
  CardIds,
  DeckProcessed,
  Direction,
  RawText,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { entries } from "modules/typescript/objectEntries";
import { calculateDependencyGraph } from "flashcards/flashcards/compile/dependencies/dependencyGraph";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";
import { log } from "modules/log";

export const compileDeck = (
  unprocessedDeck: UnprocessedDeck
): DeckProcessed => {
  const deckProcessed: DeckProcessed = {
    deckId: unprocessedDeck.deckId,
    cards: {},
    terms: {},
    alternativeIds: {},
    dependenciesUnprocessed: {},
    dependencyGraph: {},
  };
  // log(deck);
  warnIfFunctionIsSlow.start("compileRows");
  entries(unprocessedDeck.rows).forEach(([, row]) => {
    compileRow(row, deckProcessed);
  });
  warnIfFunctionIsSlow.end("compileRows");

  deckProcessed.dependencyGraph = calculateDependencyGraph(deckProcessed);
  log(deckProcessed);
  return deckProcessed;
};

/**
 * Calculates certain items such as alternativeIds and dependsOn,
 * creates cardIds
 */
export const compileRow = (row: Row, deckProcessed: DeckProcessed) => {
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
