import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckId } from "flashcards/flashcards/types";
import { saveFlashcardsStore } from "flashcards/sync/initialize";
import { makeAutoObservable, reaction } from "mobx";
import { applyFunctionToEachObjectValue } from "modules/applyFunctionToEachObjectValue";
import { isBrowser } from "modules/isBrowser";

export class FlashcardsStore {
  decks: Record<DeckId, Deck> = {};

  constructor() {
    makeAutoObservable(this);
    reaction(() => Object.keys(this.decks), saveFlashcardsStore);
  }

  toJSON() {
    return {
      decks: applyFunctionToEachObjectValue(this.decks, (deck) =>
        deck.toJSON()
      ),
    };
  }
}

const _store = new FlashcardsStore();
export const getFlashcardsStore = (): FlashcardsStore => _store;

if (isBrowser) {
  // @ts-ignore
  window["getFlashcardsStore"] = getFlashcardsStore;
}
