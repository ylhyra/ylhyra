import { DecksObject } from "flashcards/flashcards/types";
import { makeAutoObservable } from "mobx";

export class flashcardStore {
  topics = {
    asd: {
      title: "asd",
    },
  };
  deckOrder = [];
  decks: DecksObject = {
    a: {
      id: "a",
      title: "Spænska",
      topic: "asd",
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
  load() {}
}
