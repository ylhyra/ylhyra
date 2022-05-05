import {
  shouldCreateBackToFront,
  shouldCreateFrontToBack,
} from "flashcards/flashcards/compile/functions";
import { createCardId, createTermId } from "flashcards/flashcards/compile/ids";
import { Row } from "flashcards/flashcards/types/row";
import {
  CardIds,
  DeckProcessed,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { entries } from "modules/typescript/objectEntries";

export const compileDeck = (deck: UnprocessedDeck): DeckProcessed => {
  const deckProcessed: DeckProcessed = {
    deckId: deck.deckId,
    cards: {},
    terms: {},
    dependencies: {},
    alternativeIds: {},
  };
  // log(deck);
  entries(deck.rows).forEach(([, row]) => {
    compileRow(row, deckProcessed);
  });
  // log(deckProcessed);
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
  let dependsOn: Sentence[] = [];
  let alternativeIds: Sentence[] = [];
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

export type Sentence = string;
