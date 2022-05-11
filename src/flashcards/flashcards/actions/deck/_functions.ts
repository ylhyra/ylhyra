import { getFlashcardsStore } from "flashcards/flashcards/actions/baseFlashcardsStore/flashcardsStore";
import { Card } from "flashcards/flashcards/actions/card/card";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { Row } from "flashcards/flashcards/actions/row/row";
import {
  RowData,
  RowId,
} from "flashcards/flashcards/actions/row/rowData.types";
import { DeckId } from "flashcards/flashcards/types";
import { flattenArray } from "modules/arrays/flattenArray";
import { removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues } from "modules/removeExtraWhitespace";
import { customHistory } from "modules/router";
import { values } from "modules/typescript/objectEntries";
import shortid from "shortid";
import _ from "underscore";

/**
 * Called in user interface
 */
export const newDeck = () => {
  const id = shortid.generate() as DeckId;
  getFlashcardsStore().decks[id] = new Deck({
    deckId: id,
    settings: {},
    rows: {},
  });
  customHistory.replace(`/flashcards/deck/${id}`);
};

export function addRow(this: Deck, data?: Partial<RowData>): Row {
  const rowId = shortid.generate() as RowId;
  const highestRowNumber = _.max([
    0,
    ...values(this.rows).map((row) => row.data.rowNumber),
  ]);
  const row = new Row(this, {
    rowId,
    rowNumber: highestRowNumber + 1,
    ...removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues(data || {}),
  });
  this.rows[rowId] = row;
  return row;
}

export const getAllCardsFromDecks = (decks: Deck[]): Card[] => {
  return flattenArray(decks.map((deck) => deck.cards));
};
