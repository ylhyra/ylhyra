import { getFlashcardsStore } from "flashcards/flashcards/actions/baseFlashcardsStore/flashcardsStore";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckId } from "flashcards/flashcards/types";
import { action } from "mobx";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";
import { entries } from "modules/typescript/objectEntries";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

export const initializeFlashcardsStore = action(() => {
  try {
    const savedFlashcardsStore = getFromLocalStorage("decks") || {};
    return warnIfFunctionIsSlow.wrap(() => {
      entries(savedFlashcardsStore.decks).forEach(([deckId, data]) => {
        getFlashcardsStore().decks[deckId as DeckId] = new Deck(data);
      });
    }, "initializeFlashcardsStore");
  } catch (e: unknown) {
    console.error("Malformatted flashcards store data");
  }
});

export const saveFlashcardsStore = () => {
  saveInLocalStorage("decks", getFlashcardsStore().toJSON());
};

export const getDeckById = (id: DeckId | undefined): Deck | undefined => {
  if (id && id in getFlashcardsStore().decks) {
    return getFlashcardsStore().decks[id];
  }
};
