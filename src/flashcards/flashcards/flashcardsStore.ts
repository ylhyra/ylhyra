import { compileDeck } from "flashcards/flashcards/compile/compile";
import {
  CardIds,
  ProcessedDecksObject,
  UnprocessedDeck,
  UnprocessedDecksObject,
} from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";
import { entries, keys } from "modules/typescript/objectEntries";

export class flashcardsStore {
  deckOrder = [];
  decks: UnprocessedDecksObject = {};
  processedDecks: ProcessedDecksObject = {};

  constructor() {
    makeAutoObservable(this);
    this.decks = getFromLocalStorage("decks") || {};

    /* tmp */
    keys(this.decks).forEach((deckId) => {
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

export const getCardsFromAllDecks = (): CardIds => {
  let out: CardIds = [];
  entries(getFlashcardsStore().processedDecks).map(([, deck]) => {
    out = out.concat(keys(deck.cards));
  });
  return out;
};
export const getTermsFromAllDecks = () => {};
