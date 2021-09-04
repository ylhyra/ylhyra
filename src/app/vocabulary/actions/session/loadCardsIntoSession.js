import Card from "app/vocabulary/actions/card";
import { withDependencies } from "app/vocabulary/actions/functions/withDependencies";

/**
 * @module Session
 * Used to load more cards into an already ongoing session.
 * Called from createCards.
 * Options:
 * - insertImmediately
 */
export function loadCardsIntoSession(card_ids, options = {}) {
  let insertAtPosition = 0;
  if (!options.insertImmediately) {
    /* Insert new cards after the current cards */
    insertAtPosition = this.cards.filter((i) => !i.done).length;
    if (insertAtPosition) {
      insertAtPosition += 200;
    }
  }

  card_ids.forEach((id, index) => {
    if (!(id in this.deck.cards)) return;
    if (this.cards.some((c) => c.id === id)) return;
    const card = new Card(
      {
        id,
        ...this.deck.cards[id],
        dependenciesAndSameTerm: withDependencies(id, { showDepth: true }),
      },
      index + insertAtPosition,
      this
    );
    this.cards.push(card);
  });
  // this.cardHistory.slice(0, 3);
}
