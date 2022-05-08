import { initializeFlashcardsStore } from "flashcards/flashcards/stores/base/functions";
import {
  DeckIdToProcessedDeck,
  DeckIdToUnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";

export class flashcardsStore {
  deckOrder = [];
  decks: DeckIdToUnprocessedDeck = {};
  processedDecks: DeckIdToProcessedDeck = {};

  constructor() {
    makeAutoObservable(this);
  }
}

const store = new flashcardsStore();
export const getFlashcardsStore = (): flashcardsStore => store;

initializeFlashcardsStore();

// @ts-ignore
window["getFlashcardsStore"] = getFlashcardsStore;
