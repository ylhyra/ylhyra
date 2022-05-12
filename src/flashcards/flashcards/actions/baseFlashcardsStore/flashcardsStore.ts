import { initializeFlashcardsStore } from "flashcards/flashcards/actions/baseFlashcardsStore/_functions";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckId } from "flashcards/flashcards/types";
import { applyFunctionToEachObjectValue } from "modules/applyFunctionToEachObjectValue";
import { makeAutoObservable } from "mobx";

export class flashcardsStore {
  // deckOrder = [];
  decks: Record<DeckId, Deck> = {};

  constructor() {
    makeAutoObservable(this);
    // makeObservable(this, {
    //   decks: observable.shallow,
    // });
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

// @ts-ignore
window["getFlashcardsStore"] = getFlashcardsStore;
