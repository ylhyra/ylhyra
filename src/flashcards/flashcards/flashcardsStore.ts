import { tempInitializeDecks } from "flashcards/flashcards/flashcardsStore.functions";
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

tempInitializeDecks();

// @ts-ignore
window["getFlashcardsStore"] = getFlashcardsStore;
