import CardInSession from "flashcards/flashcards/actions/cardInSession";
import { CreateCardsOptions } from "flashcards/flashcards/actions/createCards";
import { getSession } from "flashcards/flashcards/sessionStore";

/**
 * Used to load more cards into an already ongoing session.
 * Called from createCards.
 */
export function loadCardsIntoSession(
  cardIds: CardIds,
  options: CreateCardsOptions = {}
) {
  const session = getSession();

  let insertAtPosition = 0;
  if (!options.insertImmediately) {
    /* Insert new cards after the current cards */
    insertAtPosition = session.cards!.filter((i) => !i.done).length;
    if (insertAtPosition) {
      insertAtPosition += 200;
    }
  }

  cardIds.forEach((id, index) => {
    session.cards!.push(
      new CardInSession({
        id,
        insertAtPosition: insertAtPosition + index,
        session: session,
      })
    );
  });
}