import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckId } from "flashcards/flashcards/types";
import { store } from "flashcards/store";
import { action } from "mobx";
import { getFromLocalStorage } from "modules/localStorage";
import { entries } from "modules/typescript/objectEntries";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

export let initialized = false;
export const initialize = action(() => {
  try {
    const savedFlashcardsStore = getFromLocalStorage("decks");
    if (!savedFlashcardsStore) return;
    warnIfFunctionIsSlow.wrap(() => {
      entries(savedFlashcardsStore.decks).forEach(([deckId, data]) => {
        store.decks[deckId as DeckId] = new Deck(data);
      });
    }, "initializeFlashcardsStore");
    setTimeout(() => (initialized = true), 0);
  } catch (e) {
    console.error(e);
    console.error("Likely malformed flashcards store data");
  }
});

export function saveStore() {
  if (!initialized) return;
  // logDev("Flashcards store saved");
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
