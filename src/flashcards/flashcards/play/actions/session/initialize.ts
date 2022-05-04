import { store } from "flashcards/app/store";
import { checkIfCardsRemaining } from "flashcards/flashcards/play/actions/session/functions";

export async function initializeSession({ deckId }: { deckId: string }) {
  const deck = store.flashcardStore.getDeckById(deckId!);
  if (!deck) throw new Error();
  checkIfCardsRemaining();

  // await syncIfNecessary();
  // if (options.shouldReset !== false) {
  //   this.reset();
  // }
  // this.checkIfCardsRemaining();
  // this.nextCard();
  // this.loadCardInInterface();
}
