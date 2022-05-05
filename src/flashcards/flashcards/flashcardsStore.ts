import {
  ProcessedDecksObject,
  UnprocessedDecksObject,
} from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";
import { tempInitializeDecks } from "flashcards/flashcards/flashcardsStore.functions";

export class flashcardsStore {
  deckOrder = [];
  decks: UnprocessedDecksObject = {};
  processedDecks: ProcessedDecksObject = {};

  constructor() {
    makeAutoObservable(this);
  }
}

const store = new flashcardsStore();
export const getFlashcardsStore = (): flashcardsStore => store;

tempInitializeDecks();

// @ts-ignore
window["getFlashcardsStore"] = getFlashcardsStore;
