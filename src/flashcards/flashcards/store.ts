import { makeAutoObservable } from "mobx";

export class flashcardStore {
  topics = {
    asd: {
      title: "asd",
    },
  };
  decks = {
    order: [],
    decks: {
      a: {
        title: "Deck A",
        topic: "asd",
        cards: {
          a: {
            front: "Front A",
            back: "Back A",
          },
          b: {
            front: "Front B",
            back: "Back B",
          },
        },
      },
    },
  };
  constructor() {
    makeAutoObservable(this);
  }
  load() {}
}
