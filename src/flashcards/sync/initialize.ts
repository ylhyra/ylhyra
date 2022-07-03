import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { getFlashcardsStore } from "flashcards/flashcards/flashcardsStore";
import { DeckId } from "flashcards/flashcards/types";
import { action } from "mobx";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";
import { logDev } from "modules/log";
import { entries } from "modules/typescript/objectEntries";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

export const initialize = action(() => {
  try {
    const savedFlashcardsStore = getFromLocalStorage("decks");
    if (!savedFlashcardsStore) return;
    warnIfFunctionIsSlow.wrap(() => {
      entries(savedFlashcardsStore.decks).forEach(([deckId, data]) => {
        getFlashcardsStore().decks[deckId as DeckId] = new Deck(data);
      });
    }, "initializeFlashcardsStore");
  } catch (e) {
    console.error(e);
    console.error("Likely malformatted flashcards store data");
  }
});

export function saveFlashcardsStore() {
  logDev("Flashcards store saved");
  saveInLocalStorage("decks", getFlashcardsStore().toJSON());
}
