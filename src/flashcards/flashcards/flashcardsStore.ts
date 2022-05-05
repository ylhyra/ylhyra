import { compileDeck } from "flashcards/flashcards/compile/compile";
import {
  ProcessedDecksObject,
  UnprocessedDeck,
  UnprocessedDecksObject,
} from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";

export class flashcardsStore {
  deckOrder = [];
  decks: UnprocessedDecksObject = {};
  processedDecks: ProcessedDecksObject = {};

  constructor() {
    makeAutoObservable(this);
    this.decks = getFromLocalStorage("decks") || {};

    /* tmp */
    Object.keys(this.decks).forEach((deckId) => {
      this.processedDecks[deckId] = compileDeck(this.decks[deckId]);
    });
  }
  save = () => {
    saveInLocalStorage("decks", this.decks);
  };
}

const store = new flashcardsStore();
export const getFlashcardsStore = (): flashcardsStore => store;

export const getDeckById = (
  id: string | undefined
): UnprocessedDeck | undefined => {
  if (id && id in store.decks) {
    return store.decks[id];
  }
};

export const getCardsFromAllDecks = () => {};
export const getTermsFromAllDecks = () => {};
