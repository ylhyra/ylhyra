import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { Row } from "flashcards/flashcards/actions/row/row";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import { DeckId } from "flashcards/flashcards/types";
import { store } from "flashcards/store";
import { getUserDataValueFromLocalStorage } from "flashcards/userData/localStorage";
import { sync } from "flashcards/userData/sync";
import {
  storeKeysToSave,
  userDataStore,
} from "flashcards/userData/userDataStore";
import { action } from "mobx";

// export let initialized = false;
export const initialize = action(() => {
  try {
    /** Load data from localStorage into {@link userDataStore} */
    Object.keys(localStorage).forEach((_key) => {
      const values = getUserDataValueFromLocalStorage(_key);
      if (!values) return;
      userDataStore.set({ ...values, isInitializingFromLocalStorage: true });
    });

    // TODO UserDataStore.lastSynced

    applyChangesToMainStore();
    void sync();
  } catch (e) {
    console.error(e);
    console.error("Likely malformed flashcards store data");
  }
});

export function applyChangesToMainStore() {
  for (const deckId in userDataStore.valuesByType.deck) {
    store.decks[deckId as DeckId] = new Deck(
      deckId as DeckId,
      userDataStore.valuesByType.deck[deckId].value as DeckSettings,
    );
  }

  for (const rowId in userDataStore.valuesByType.row) {
    const rowData = userDataStore.valuesByType.row[rowId].value as RowData;
    const deck = store.decks[rowData.deckId];
    if (deck) {
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
}
