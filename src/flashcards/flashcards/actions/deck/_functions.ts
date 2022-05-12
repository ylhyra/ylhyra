import { isBrowser } from "modules/isBrowser";
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
export const newDeck = (): Deck => {
  const id = shortid.generate() as DeckId;
  const deck = new Deck({
    deckId: id,
    settings: {},
    rows: {},
  });
  getFlashcardsStore().decks[id] = deck;
  if (isBrowser) {
    customHistory.replace(`/flashcards/deck/${id}`);
  }
  return deck;
};

export function addRow(this: Deck, data: Partial<RowData> = {}): Row {
  return this.addMultipleRows([data]);
}

export function addMultipleRows(
  this: Deck,
  arrayOfRowData: Partial<RowData>[]
) {
  let rows: Row[] = [];
  let i = 0;
  const baseId = shortid.generate();
  const highestRowNumber = _.max([
    0,
    ...values(this.rows).map((row) => row.data.rowNumber),
  ]);
  arrayOfRowData.forEach((rowData) => {
    const rowId = `${baseId}${i}` as RowId;
    const row = new Row(this, {
      rowId,
      rowNumber: highestRowNumber + 1 + i++,
      ...removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues(
        rowData || {}
      ),
    });
    rows.push(row);
  });
  this.rowsArray = this.rowsArray.concat(rows);
  return rows[0];
}

export const getAllCardsFromDecks = (decks: Deck[]): Card[] => {
  return flattenArray(decks.map((deck) => deck.cards));
};
