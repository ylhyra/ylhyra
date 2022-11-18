import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
// import { syncIfNecessary } from "flashcards/sync/sync";
import { action } from "mobx";

export const initializeSession = action((decks: Deck[]) => {
  const session = store.session;
  session.reset();
  session.allowedDecks = decks;
  nextCard();
  // syncIfNecessary();
});
