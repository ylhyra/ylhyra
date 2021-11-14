import CardInSession from "app/vocabulary/actions/cardInSession";
import { CardIds } from "app/vocabulary/actions/card/types";

/**
 * Used to load more cards into an already ongoing session.
 * Called from createCards.
 * @memberOf Session#
 */
export function loadCardsIntoSession(card_ids: CardIds, options: any = {}) {
  let insertAtPosition = 0;
  if (!options.insertImmediately) {
    /* Insert new cards after the current cards */
    insertAtPosition = this.cards.filter((i) => !i.done).length;
    if (insertAtPosition) {
      insertAtPosition += 200;
    }
  }

  card_ids.forEach((id, index) => {
    this.cards.push(
      new CardInSession({
        id,
        insertAtPosition: insertAtPosition + index,
        session: this,
      })
    );
  });
}
