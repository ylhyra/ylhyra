import store from "app/App/store";
import Card from "app/Vocabulary/actions/card";
import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";
import { syncIfNecessary } from "app/Vocabulary/actions/sync";

/**
 * @memberof Session
 */
export async function InitializeSession(options = {}) {
  await syncIfNecessary();
  const session = this;
  if (options.shouldReset !== false) {
    this.reset();
  }
  // this.allowed_card_ids = null;
  // if (Array.isArray(input)) {
  //   this.loadCards(input);
  // }
  this.checkIfCardsRemaining();
  this.nextCard();
  this.loadCard();
}

/**
 * @memberof Session
 * Used to load more cards into an already ongoing session
 */
export function loadCards(card_ids) {
  let insertAtPosition = this.cards.filter((i) => !i.done).length;
  if (insertAtPosition) {
    insertAtPosition += 200;
  }
  card_ids.forEach((id, index) => {
    if (!(id in this.deck.cards)) return;
    if (this.cards.some((c) => c.id === id)) return;
    const card = new Card(
      {
        id,
        ...this.deck.cards[id],
        dependencyDepth: withDependencies(id, { showDepth: true }),
      },
      index + insertAtPosition,
      this
    );
    this.cards.push(card);
  });
}
