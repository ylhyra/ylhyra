import { Row, RowId } from "flashcards/flashcards/types/row";
import {
  DeckProcessed,
  Direction,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";

export const compileDeck = (deck: UnprocessedDeck): DeckProcessed => {
  let cards: DeckProcessed["cards"] = {};
  let terms: DeckProcessed["terms"] = {};
  let dependencies: DeckProcessed["dependencies"] = {};
  let alternativeIds: DeckProcessed["alternativeIds"] = {};
  return { cards, terms, dependencies, alternativeIds };
};

/**
 * Calculates certain items such as alternativeIds and dependsOn
 */
export const compileRow = (row: Row) => {
  if (!row.front || !row.back) return null;

  // let dependencies: RowIdToRowIds = {};
  // let alternativeIds: RowIdToRowIds = {};
  let dependsOn: Sentence[] = [];
  let alternativeIds: Sentence[] = [];
  let cardIds: CardIds = [];

  // let termsInThisLine = [row.front, ...row.front.split(/(?:;+| [-–—] )/g)];
  //
  // addValuesToADependencyGraph(dependencies, termsInThisLine, dependsOn);
  // addValuesToADependencyGraph(alternativeIds, alternativeIds, termsInThisLine);

  if (row.direction === "BOTH" || row.direction === "FRONT_TO_BACK") {
    cardIds.push(createCardId(row.rowId, "FRONT_TO_BACK"));
  }
};

export const createCardId = (rowId: RowId, direction: Direction): CardId => {
  return `${rowId}-${direction}` as CardId;
};

export type Sentence = string;
