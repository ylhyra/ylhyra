import { store } from "flashcards/store";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { action } from "mobx";

export const initializeSession = action((deck: Deck) => {
  const session = store.session;
  session.reset();
  session.chosenDeck = deck;
  nextCard();
  // syncIfNecessary();
});
