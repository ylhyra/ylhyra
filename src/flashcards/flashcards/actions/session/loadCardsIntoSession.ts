import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";

/**
 * Used to load more cards into an already ongoing session.
 * Called from {@link createCards}.
 */
export function loadCardsIntoSession(cards: Card[]) {
  const session = store.session;

  cards.forEach((card, index) => {
    session.cards.push(
      new CardInSession(card, session, {
        insertAtPosition: index,
      }),
    );
  });
}
