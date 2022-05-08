import {
  DeckId,
  DeckIdToProcessedDeck,
  DeckIdToUnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { deckStore } from "flashcards/flashcards/stores/deck/deckStore";
import { initializeFlashcardsStore } from "flashcards/flashcards/stores/base/functions";
import { makeAutoObservable } from "mobx";

export class flashcardsStore {
  // deckOrder = [];
  decks: Record<DeckId, deckStore> = {};
  /** @deprecated */
  OLDdecks: DeckIdToUnprocessedDeck = {};
  /** @deprecated */
  OLDprocessedDecks: DeckIdToProcessedDeck = {};

  constructor() {
    makeAutoObservable(this);
  }
}

const store = new flashcardsStore();
export const getFlashcardsStore = (): flashcardsStore => store;

initializeFlashcardsStore();

// @ts-ignore
window["getFlashcardsStore"] = getFlashcardsStore;
