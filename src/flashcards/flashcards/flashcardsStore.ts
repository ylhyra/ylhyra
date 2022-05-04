import {
  UnprocessedDeck,
  UnprocessedDecksObject,
} from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";
import { UserData } from "flashcards/flashcards/actions/userData/userData";

export class flashcardsStore {
  topics = {};
  deckOrder = [];
  decks: UnprocessedDecksObject = {};
  processedDecks = {};

  cards: Cards = {};
  terms: Terms = {};

  constructor() {
    makeAutoObservable(this);
    this.decks = getFromLocalStorage("decks") || {};
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

const store = new flashcardsStore();
export const getFlashcardsStore = (): flashcardsStore => store;
