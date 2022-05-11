import { initializeFlashcardsStore } from "flashcards/flashcards/actions/baseFlashcardsStore/_functions";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckId } from "flashcards/flashcards/types";
import { makeAutoObservable } from "mobx";
import { applyFunctionToEachObjectValue } from "modules/applyFunctionToEachObjectValue";

export class flashcardsStore {
  // deckOrder = [];
  decks: Record<DeckId, Deck> = {};

  constructor() {
    makeAutoObservable(this);
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
