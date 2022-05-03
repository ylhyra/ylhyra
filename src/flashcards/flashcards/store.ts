import { Deck, IdToDeck } from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";

export class flashcardStore {
  topics = {
    asd: {
      title: "asd",
    },
  };
  deckOrder = [];
  decks: IdToDeck = {
    a: {
      id: "a",
      settings: {
        title: "Spænska",
        topic: "asd",
      },
      cards: {
        a: {
          id: "a",
          front: "Front A",
          back: "Back A",
        },
        b: {
          id: "b",
          front: "Front B",
          back: "Back B",
        },
      },
    },
  };

  constructor() {
    makeAutoObservable(this);
  }

  getDeck = (id: string): Deck => {
    if (id in this.decks) {
      return this.decks[id];
    } else {
      throw new Error(`Deck with id ${id} does not exist`);
    }
  };

  load() {}
}

export const getDeckTitle = (deck: Deck) => {
  return deck.settings.title || "(untitled)";
};
