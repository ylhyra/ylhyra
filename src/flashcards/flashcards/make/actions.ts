import { getFlashcardsStore } from "flashcards/flashcards/flashcardsStore";
import { RowId } from "flashcards/flashcards/types/row";
import { customHistory } from "modules/router";
import shortid from "shortid";

export const newDeck = () => {
  const id = shortid.generate();
  getFlashcardsStore().decks[id] = {
    deckId: id,
    settings: {},
    rows: {},
  };
  customHistory.replace(`/flashcards/deck/${id}`);
};

export const addLine = (deckId: string) => {
  const rowId = shortid.generate() as RowId;
  /* Todo */
  const rowNumber = 0;
  getFlashcardsStore().decks[deckId].rows[rowId] = {
    rowId,
    rowNumber,
  };
  return rowId;
};
