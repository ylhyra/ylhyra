import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { CreateCardsOptions } from "flashcards/flashcards/actions/createCards";
import { getSession } from "flashcards/flashcards/actions/session/session";

/**
 * Used to load more cards into an already ongoing session.
 * Called from {@link createCards}.
 */
export function loadCardsIntoSession(
  cards: Card[],
  options: CreateCardsOptions = {}
) {
  const session = getSession();

  let insertAtPosition = 0;
  if (!options.insertImmediately) {
    /* Insert new cards after the current cards */
    insertAtPosition = session.cards.filter((i) => !i.done).length;
    if (insertAtPosition) {
      insertAtPosition += 200;
    }
  }

  cards.forEach((cardId, index) => {
    session.cards.push(
      new CardInSession({
        cardId,
        insertAtPosition: insertAtPosition + index,
      })
    );
  });
}
