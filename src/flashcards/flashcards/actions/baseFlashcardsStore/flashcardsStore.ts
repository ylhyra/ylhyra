
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckId } from "flashcards/flashcards/types";
import { initializeFlashcardsStore, saveFlashcardsStore } from "flashcards/sync/initialize";
import { makeAutoObservable, reaction } from "mobx";
import { applyFunctionToEachObjectValue } from "modules/applyFunctionToEachObjectValue";
import { isBrowser } from "modules/isBrowser";

export class flashcardsStore {
  decks: Record<DeckId, Deck> = {};

  constructor() {
    makeAutoObservable(this);

    /** Auto-save (after initialization is complete) */
    setTimeout(() => {
      reaction(() => Object.keys(this.decks), saveFlashcardsStore);
    }, 500);
  }

  toJSON() {
    return {
      decks: applyFunctionToEachObjectValue(this.decks, (deck) =>
        deck.toJSON()
      ),
    };
  }
}

const store = new flashcardsStore();
export const getFlashcardsStore = (): flashcardsStore => store;

initializeFlashcardsStore();

if (isBrowser) {
  // @ts-ignore
  window["getFlashcardsStore"] = getFlashcardsStore;
}
