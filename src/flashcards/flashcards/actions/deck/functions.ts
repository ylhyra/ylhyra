import { userDataStore } from "flashcards/userData/userDataStore";
import { Card } from "flashcards/flashcards/actions/card/card";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { Row } from "flashcards/flashcards/actions/row/row";
import {
  RowData,
  RowId,
} from "flashcards/flashcards/actions/row/rowData.types";
import { DeckId } from "flashcards/flashcards/types";
import { store } from "flashcards/store";
import { action } from "mobx";
import { flattenArray } from "modules/arrays/flattenArray";
import { isBrowser } from "modules/isBrowser";
import { removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues } from "modules/removeExtraWhitespace";
import { goToUrl } from "modules/router";
import shortid from "shortid";
import _ from "underscore";

export function newDeck(): Deck {
  return action(() => {
    const deckId = shortid.generate() as DeckId;
    const settings = userDataStore.set({
      type: "deck",
      key: deckId,
      value: {},
    }).value;
    const deck = new Deck(deckId, settings);
    if (isBrowser) {
      goToUrl(`/flashcards/deck/${deckId}`);
    }
    return deck;
  })();
}

// Todo: Undoable
export const deleteDeck = action((deck: Deck) => {
  if (window.confirm("Are you sure you want to delete this deck?")) {
    deck.settings.deleted = true;
    goToUrl("/flashcards");
  }
});

export function addRow(deck: Deck, data: Partial<RowData> = {}) {
  return addRowsToDeck(deck, [data]);
}

export function addRowsToDeck(deck: Deck, arrayOfRowData: Partial<RowData>[]) {
  return action(() => {
    let i = 0;
    const baseId = shortid.generate();
    const highestRowNumber = _.max([
      0,
      ...[...deck.rows.values()].map((row) => row.data.rowNumber),
    ]);
    arrayOfRowData.forEach((rowData) => {
      const rowId = `${baseId}${i}` as RowId;
      let value: RowData = {
        deckId: deck.deckId,
        rowId,
        rowNumber: highestRowNumber + 1 + i++,
        ...removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues(
          rowData || {},
        ),
      };
      value = userDataStore.set({
        type: "row",
        key: rowId,
        value,
      }).value;
      new Row(deck, value);
    });
  })();
}

export function getAllCardsFromDecks(decks: Deck[]): Card[] {
  return flattenArray(decks.map((deck) => deck.cards));
}

export function getDeckById(id: DeckId | undefined): Deck | undefined {
  return id && store.decks.get(id);
}
