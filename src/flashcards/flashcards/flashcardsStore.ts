import {
  IdToUnprocessedDeck,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";

export class flashcardStore {
  topics = {};
  deckOrder = [];
  decks: IdToUnprocessedDeck = getFromLocalStorage("decks") || {};

  constructor() {
    makeAutoObservable(this);
  }

  getDeckById = (id: string): UnprocessedDeck | undefined => {
    if (id in this.decks) {
      return this.decks[id];
    }
  };
  save = () => {
    saveInLocalStorage("decks", this.decks);
  };

  load() {}
}

export const printDeckTitle = (deck: UnprocessedDeck) => {
  return deck.settings.title || "(untitled)";
};

const store = new flashcardStore();
export const getFlashcardsStore = (): flashcardStore => store;
