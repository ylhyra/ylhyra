import CardInSession from "flashcards/flashcards/play/actions/cardInSession";
import { CreateCardsOptions } from "flashcards/flashcards/play/actions/createCards";
;

/**
 * Used to load more cards into an already ongoing session.
 * Called from createCards.
 *
 */
export function loadCardsIntoSession(
  "flashcards/app/store",
  cardIds: CardIds,
  options: CreateCardsOptions = {}
) {
  let insertAtPosition = 0;
  if (!options.insertImmediately) {
    /* Insert new cards after the current cards */
    insertAtPosition = this.cards!.filter((i) => !i.done).length;
    if (insertAtPosition) {
      insertAtPosition += 200;
    }
  }

  cardIds.forEach((id, index) => {
    this.cards!.push(
      new CardInSession({
        id,
        insertAtPosition: insertAtPosition + index,
        session: this,
      })
    );
  });
}
