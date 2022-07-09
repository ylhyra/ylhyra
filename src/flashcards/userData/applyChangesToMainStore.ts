import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { Row } from "flashcards/flashcards/actions/row/row";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import { DeckId } from "flashcards/flashcards/types";
import { store } from "flashcards/store";
import {
  storeKeysToSave,
  userDataStore,
} from "flashcards/userData/userDataStore";
import { action } from "mobx";

/**
 * Apply certain changes from {@link userDataStore} to {@link store}.
 * Values are automatically updated, but we need to manually update
 * nested objects.
 * Runs after {@link initialize} and {@link sync}.
 */
export const applyChangesToMainStore = action(() => {
  for (const deckId in userDataStore.valuesByType.deck) {
    if (!(deckId in store.decks)) {
      store.decks[deckId as DeckId] = new Deck(
        deckId as DeckId,
        userDataStore.valuesByType.deck[deckId].value as DeckSettings,
      );
    }
  }

  for (const rowId in userDataStore.valuesByType.row) {
    const rowData = userDataStore.valuesByType.row[rowId].value as RowData;
    const deck = store.decks[rowData.deckId];
    if (deck && !deck.rows.some((r) => r.rowId === rowId)) {
      deck.rows.push(new Row(deck, rowData));
    }
  }

  for (const key of storeKeysToSave) {
    const value = userDataStore.values[key]?.value;
    if (value) {
      // @ts-ignore
      store[key] = value;
    }
  }
});
