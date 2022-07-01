import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { syncIfNecessary } from "flashcards/user/userData/sync";
import { action } from "mobx";

export const initializeSession = action((decks: Deck[]) => {
  const session = getSession();
  session.reset();
  session.allowedDecks = decks;
  nextCard();
  syncIfNecessary();
});
