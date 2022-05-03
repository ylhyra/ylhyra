import { Deck, IdToDeck } from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";

export class flashcardStore {
  topics = {
    asd: {
      title: "asd",
    },
  };
  deckOrder = [];
  decks: IdToDeck = getFromLocalStorage("decks") || {};

  constructor() {
    makeAutoObservable(this);
  }

  getDeckById = (id: string): Deck | undefined => {
    if (id in this.decks) {
      return this.decks[id];
    }
  };
  save = () => {
    saveInLocalStorage("decks", this.decks);
  };

  load() {}
}

export const getDeckTitle = (deck: Deck) => {
  return deck.settings.title || "(untitled)";
};
