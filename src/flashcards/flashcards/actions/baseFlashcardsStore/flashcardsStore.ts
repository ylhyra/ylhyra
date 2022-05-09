import { initializeFlashcardsStore } from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckId } from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";

export class flashcardsStore {
  // deckOrder = [];
  decks: Record<DeckId, Deck> = {};

  constructor() {
    makeAutoObservable(this);
  }
}

const store = new flashcardsStore();
export const getFlashcardsStore = (): flashcardsStore => store;

initializeFlashcardsStore();

// @ts-ignore
window["getFlashcardsStore"] = getFlashcardsStore;
