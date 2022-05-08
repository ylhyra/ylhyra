import { deckStore } from "flashcards/flashcards/stores/deck/deckStore";

export const printDeckTitle = (deck: deckStore) => {
  return deck.settings.title || "(untitled)";
};
