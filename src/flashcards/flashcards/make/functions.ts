import { Deck } from "flashcards/flashcards/actions/deck/deck";

export const printDeckTitle = (deck: Deck) => {
  return deck.settings.title || "(untitled)";
};
