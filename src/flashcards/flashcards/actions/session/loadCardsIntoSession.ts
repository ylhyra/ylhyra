import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getSession } from "flashcards/flashcards/actions/session/session";

/**
 * Used to load more cards into an already ongoing session.
 * Called from {@link createCards}.
 */
export function loadCardsIntoSession(cards: Card[]) {
  const session = getSession();

  cards.forEach((card, index) => {
    session.cards.push(
      new CardInSession(card, session, {
        insertAtPosition: index,
      }),
    );
  });
}
