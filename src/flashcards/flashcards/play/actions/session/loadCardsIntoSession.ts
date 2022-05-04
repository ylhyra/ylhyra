import CardInSession from "flashcards/flashcards/play/actions/cardInSession";
import { CreateCardsOptions } from "flashcards/flashcards/play/actions/createCards";
import { getSession } from "flashcards/flashcards/play/actions/session/sessionStore";

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
