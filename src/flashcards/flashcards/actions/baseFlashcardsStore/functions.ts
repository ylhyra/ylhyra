import { getFlashcardsStore } from "flashcards/flashcards/actions/baseFlashcardsStore/flashcardsStore";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckId } from "flashcards/flashcards/types";
import { action } from "mobx";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";
import { entries } from "modules/typescript/objectEntries";

export const initializeFlashcardsStore = action(() => {
  const decks = getFromLocalStorage("decks") || {};
  entries(decks).forEach(([deckId, data]) => {
    getFlashcardsStore().decks[deckId as DeckId] = new Deck(data);
  });
});

export const saveFlashcardsStore = () => {
  throw new Error("Not implemented");
  saveInLocalStorage("decks", getFlashcardsStore().decks);
};

export const getDeckById = (id: DeckId | undefined): Deck | undefined => {
  if (id && id in getFlashcardsStore().decks) {
    return getFlashcardsStore().decks[id];
  }
};
