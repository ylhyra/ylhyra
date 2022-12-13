import { store } from "flashcards/store";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { action } from "mobx";
import { CardChooser } from "flashcards/flashcards/actions/createCards/cardChooser";

export const initializeSession = action((deck: Deck) => {
  const session = store.session;
  session.reset();
  session.chosenDeck = deck;
  session.cardChooser = new CardChooser(deck);
  nextCard();
  // syncIfNecessary();
});
