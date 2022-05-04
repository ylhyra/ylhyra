import { getFlashcardsStore } from "flashcards/flashcards/flashcardsStore";
import { customHistory } from "modules/router";
import shortid from "shortid";

export const newDeck = () => {
  const id = shortid.generate();
  getFlashcardsStore().decks[id] = {
    id,
    settings: {},
    cards: {},
  };
  customHistory.replace(`/flashcards/deck/${id}`);
};

export const addLine = (deckId: string) => {
  const id = shortid.generate();

  getFlashcardsStore().decks[deckId].cards[id] = {
    id,
  };
  return id;
};
