import {
  createCardId,
  shouldCreateBackToFront,
  shouldCreateFrontToBack,
} from "flashcards/flashcards/compile/functions";
import { Row } from "flashcards/flashcards/types/row";
import {
  CardIds,
  DeckProcessed,
  TermId,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { log } from "modules/log";
import { entries } from "modules/typescript/objectEntries";

export const compileDeck = (deck: UnprocessedDeck): DeckProcessed => {
  const deckProcessed: DeckProcessed = {
    cards: {},
    terms: {},
    dependencies: {},
    alternativeIds: {},
  };
  log(deck);
  entries(deck.rows).forEach(([, row]) => {
    compileRow(row, deckProcessed);
  });
  log(deckProcessed);
  return deckProcessed;
};

/**
 * Calculates certain items such as alternativeIds and dependsOn
 */
export const compileRow = (row: Row, deckProcessed: DeckProcessed) => {
  if (!row.front || !row.back) return null;

  // let dependencies: RowIdToRowIds = {};
  // let alternativeIds: RowIdToRowIds = {};
  let dependsOn: Sentence[] = [];
  let alternativeIds: Sentence[] = [];
  let cardIds: CardIds = [];
  /** TODO find better naming */
  const termId = row.rowId as unknown as TermId;

  // let termsInThisLine = [row.front, ...row.front.split(/(?:;+| [-–—] )/g)];
  //
  // addValuesToADependencyGraph(dependencies, termsInThisLine, dependsOn);
  // addValuesToADependencyGraph(alternativeIds, alternativeIds, termsInThisLine);

  if (shouldCreateFrontToBack(row)) {
    cardIds.push(createCardId(termId, "FRONT_TO_BACK"));
  }
  if (shouldCreateBackToFront(row)) {
    cardIds.push(createCardId(termId, "BACK_TO_FRONT"));
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

export type Sentence = string;
