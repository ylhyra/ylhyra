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
import { isBrowser } from "modules/isBrowser";
import { removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues } from "modules/removeExtraWhitespace";
import { goToUrl } from "modules/router";
import shortid from "shortid";
import _ from "underscore";

/** Called in user interface */
export function newDeck(): Deck {
  const id = shortid.generate() as DeckId;
  const deck = new Deck({
    deckId: id,
  });
  getFlashcardsStore().decks[id] = deck;
  if (isBrowser) {
    goToUrl(`/flashcards/deck/${id}`);
  }
  return deck;
}

export function addRow(deck: Deck, data: Partial<RowData> = {}) {
  return addRowsToDeck(deck, [data]);
}

export function addRowsToDeck(deck: Deck, arrayOfRowData: Partial<RowData>[]) {
  let rows: Record<RowId, Row> = {};
  let rowsArray: Row[] = [];
  let i = 0;
  const baseId = shortid.generate();
  const highestRowNumber = _.max([
    0,
    ...deck.rows.map((row) => row.data.rowNumber),
  ]);
  arrayOfRowData.forEach((rowData) => {
    const rowId = `${baseId}${i}` as RowId;
    const row = new Row(deck, {
      rowId,
      rowNumber: highestRowNumber + 1 + i++,
      ...removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues(
        rowData || {}
      ),
    });
    // rows[rowId] = row;
    rowsArray.push(row);
  });
  // deck.rows = { ...this.rows, ...rows };
  deck.rows = deck.rows.concat(rowsArray);
}

export function getAllCardsFromDecks(decks: Deck[]): Card[] {
  return flattenArray(decks.map((deck) => deck.cards));
}
