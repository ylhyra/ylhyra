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

export const printDeckTitle = (deck: UnprocessedDeck) => {
  return deck.settings.title || "(untitled)";
};
