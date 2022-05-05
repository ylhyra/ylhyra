import { compileDeck } from "flashcards/flashcards/compile/compile";
import {
  CardIds,
  DeckProcessed,
  ProcessedDecksObject,
  UnprocessedDeck,
  UnprocessedDecksObject,
} from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";
import { entries, keys, values } from "modules/typescript/objectEntries";

export class flashcardsStore {
  deckOrder = [];
  decks: UnprocessedDecksObject = {};
  processedDecks: ProcessedDecksObject = {};

  constructor() {
    makeAutoObservable(this);
    this.decks = getFromLocalStorage("decks") || {};

    /* tmp */
    values(this.decks).forEach((deck) => {
      this.processedDecks[deck.deckId] = compileDeck(deck);
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

export const getCardIdsFromAllDecks = (): CardIds => {
  let out: CardIds = [];
  values(getFlashcardsStore().processedDecks).map((deck) => {
    out = out.concat(keys(deck.cards));
  });
  return out;
};
export const getTermsFromAllDecks = (): DeckProcessed["terms"] => {
  let out: DeckProcessed["terms"] = {};
  values(getFlashcardsStore().processedDecks).map((deck) => {
    entries(deck.terms).map(([termId, termInfo]) => {
      out[termId] = termInfo;
    });
  });
  return out;
};

// @ts-ignore
window["getFlashcardsStore"] = getFlashcardsStore;
// @ts-ignore
window["getCardsFromAllDecks"] = getCardIdsFromAllDecks;
