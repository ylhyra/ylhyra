// import { store } from "flashcards/store";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckId } from "flashcards/flashcards/types";
import { action } from "mobx";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";
import { logDev } from "modules/log";
import { entries } from "modules/typescript/objectEntries";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

// export type SYNC_STORE = Record<
//   string,
//   {
//     type: "deck";
//     data: DeckSettings;
//   }
// >;
//
// const keyValueStore = {};

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
  logDev("Flashcards store saved");
  saveInLocalStorage("decks", store.toJSON());
}
