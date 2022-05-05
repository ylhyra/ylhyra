import { createCardId } from "flashcards/flashcards/compile/functions";
import { Row } from "flashcards/flashcards/types/row";
import {
  CardIds,
  DeckProcessed,
  TermId,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { entries } from "modules/typescript/objectEntries";

export const compileDeck = (deck: UnprocessedDeck): DeckProcessed => {
  const deckProcessed: DeckProcessed = {
    cards: {},
    terms: {},
    dependencies: {},
    alternativeIds: {},
  };
  console.log(deck);
  entries(deck.rows).forEach(([, row]) => {
    compileRow(row, deckProcessed);
  });
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

  if (row.direction === "BOTH" || row.direction === "FRONT_TO_BACK") {
    cardIds.push(createCardId(termId, "FRONT_TO_BACK"));
  }
  if (row.direction === "BOTH" || row.direction === "BACK_TO_FRONT") {
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
