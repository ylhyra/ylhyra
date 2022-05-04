import { store } from "flashcards/app/store";
import { createCardsIfNoneAreRemaining } from "flashcards/flashcards/play/actions/session/functions";
import { nextCard } from "flashcards/flashcards/play/actions/session/nextCard";
import { syncIfNecessary } from "flashcards/flashcards/play/actions/userData/sync";

export function initializeSession({ deckId }: { deckId: string }) {
  const deck = store.flashcardStore.getDeckById(deckId!);
  if (!deck) throw new Error();
  createCardsIfNoneAreRemaining();
  nextCard();
  void syncIfNecessary();

  // if (options.shouldReset !== false) {
  //   session.reset();
  // }
  // session.checkIfCardsRemaining();
  // session.nextCard();
  // session.loadCardInInterface();
}
