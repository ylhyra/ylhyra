import { getFlashcardsStore } from "flashcards/flashcards/actions/baseFlashcardsStore/flashcardsStore";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { Row } from "flashcards/flashcards/actions/row/row";
import { RowId } from "flashcards/flashcards/actions/row/rowData.types";
import { DeckId } from "flashcards/flashcards/types";
import { customHistory } from "modules/router";
import { values } from "modules/typescript/objectEntries";
import shortid from "shortid";
import _ from "underscore";

export const newDeck = () => {
  const id = shortid.generate() as DeckId;
  getFlashcardsStore().decks[id] = new Deck({
    deckId: id,
    settings: {},
    rows: {},
  });
  customHistory.replace(`/flashcards/deck/${id}`);
};

export function addRow(this: Deck): Row {
  const rowId = shortid.generate() as RowId;
  const row = new Row(this, {
    rowId,
    rowNumber: getHighestRowNumber(this) + 1,
  });
  this.rows[rowId] = row;
  return row;
}

export const getHighestRowNumber = (deck: Deck): number => {
  return _.max(values(deck.rows).map((row) => row.data.rowNumber)) || 0;
};
