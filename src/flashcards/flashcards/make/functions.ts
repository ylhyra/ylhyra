import { UnprocessedDeck } from "flashcards/flashcards/types/types";

export const printDeckTitle = (deck: UnprocessedDeck) => {
  return deck.settings.title || "(untitled)";
};
