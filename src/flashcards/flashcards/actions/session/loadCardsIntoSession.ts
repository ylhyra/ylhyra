import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { CreateCardsOptions } from "flashcards/flashcards/actions/createCards";
import { getSession } from "flashcards/flashcards/sessionStore";
import { CardIds } from "flashcards/flashcards/types/types";

/**
 * Used to load more cards into an already ongoing session.
 * Called from {@link createCards}.
 */
export function loadCardsIntoSession(
  cardIds: CardIds,
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

  cardIds.forEach((cardId, index) => {
    session.cards.push(
      new CardInSession({
        cardId,
        insertAtPosition: insertAtPosition + index,
      })
    );
  });
}
