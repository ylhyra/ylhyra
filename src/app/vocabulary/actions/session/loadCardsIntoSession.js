import CardInSession from "app/vocabulary/actions/cardInSession";

/**
 * Used to load more cards into an already ongoing session.
 * Called from createCards.
 * @memberOf Session
 * @param {Array.<Card>} cards
 * @param {Object=} options
 * @param {boolean} options.insertImmediately
 */
export function loadCardsIntoSession(cards, options = {}) {
  let insertAtPosition = 0;
  if (!options.insertImmediately) {
    /* Insert new cards after the current cards */
    insertAtPosition = this.cards.filter((i) => !i.done).length;
    if (insertAtPosition) {
      insertAtPosition += 200;
    }
  }

  cards.forEach((card, index) => {
    this.cards.push(
      new CardInSession({
        data: card.data,
        insertAtPosition: insertAtPosition + index,
        session: this,
      })
    );
  });
}
