import { CardIds } from "ylhyra/app/vocabulary/actions/card/types";
import CardInSession from "ylhyra/app/vocabulary/actions/cardInSession";
import { CreateCardsOptions } from "ylhyra/app/vocabulary/actions/createCards";
import Session from "ylhyra/app/vocabulary/actions/session/index";

/**
 * Used to load more cards into an already ongoing session.
 * Called from createCards.
 *
 */
export function loadCardsIntoSession(
  this: Session,
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
