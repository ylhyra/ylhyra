import store from "app/App/store";
import _ from "underscore";
import Card, { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";
import {
  printWord,
  getCardsWithSameTerm,
  // filterOnlyCardsThatExist,
} from "app/Vocabulary/actions/functions";
import { PercentageKnown } from "app/Vocabulary/actions/functions/percentageKnown";
import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";
import createCards from "app/Vocabulary/actions/createCards";

/**
 * @memberof Session
 */
export function InitializeSession(input, shouldReset) {
  const session = this;
  shouldReset !== false && this.reset();
  // this.allowed_card_ids = null;
  if (Array.isArray(input)) {
    this.loadCards(input);
  }
  this.checkIfCardsRemaining();
  this.nextCard();
  store.dispatch({
    type: "LOAD_SESSION",
    content: session,
  });
  this.loadCard();
}

/**
 * @memberof Session
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
