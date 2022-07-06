import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { Row } from "flashcards/flashcards/actions/row/row";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import { DeckId } from "flashcards/flashcards/types";
import { store } from "flashcards/store";
import {
  FLASHCARDS_LOCALSTORAGE_PREFIX,
  storeKeysToSave,
  userDataStore,
} from "flashcards/sync/userDataStore";
import { action, observable } from "mobx";
import { getFromLocalStorage } from "modules/localStorage";
import { logDev } from "modules/log";

export let initialized = false;
export const initialize = action(() => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (!key.startsWith(FLASHCARDS_LOCALSTORAGE_PREFIX)) return;
      const { type, value } = getFromLocalStorage(key);
      userDataStore.set(
        key.slice(FLASHCARDS_LOCALSTORAGE_PREFIX.length),
        observable(value),
        type,
        true,
      );
    });

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

    // TODO UserDataStore.lastSynced
  } catch (e) {
    console.error(e);
    console.error("Likely malformed flashcards store data");
  }
});

export function saveStore() {
  if (!initialized) return;
  logDev("Flashcards store saved");

  // const records: (keyof Store)[] = [
  //   "decks",
  //   "schedule",
  //   "sessionLog" /*"rows"*/,
  // ];
  //
  // let toSave = toJS({
  //   user: store.user,
  //   userSettings: store.userSettings,
  //   decks: applyFunctionToEachObjectValue(store.decks, (deck) => deck.toJSON()),
  //   deckOrder: store.deckOrder,
  //   schedule: store.schedule,
  //   sessionLog: store.sessionLog,
  //   lastSynced: store.lastSynced,
  //   needsSyncing: store.needsSyncing,
  // });
  //
  // saveInLocalStorage("decks", toSave);
}
