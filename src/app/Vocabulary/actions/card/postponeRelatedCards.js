import { BAD, GOOD, EASY } from "./index";
import _ from "underscore";

/**
 * @memberof Card
 */
export default function postponeRelatedCards(card1_interval) {
  const card1 = this;
  card1.terms.forEach((term) => {
    card1.session.cards.forEach((card2) => {
      if (card2.id === card1.id) return;

      // Same term
      if (card2.terms.includes(term)) {
        let max = 300;
        if (
          (card2.score && card2.score < GOOD) ||
          card1.history.includes(BAD) ||
          card2.history.includes(BAD)
        ) {
          max = 10;
        }
        card2.showIn({ interval: Math.min(card1_interval, max) });
      }

      // Cards that directly rely on this card
      else if (
        false
        // _.intersection(card2.dependencies, card.dependencies).length > 0
      ) {
        card2.showIn({ minInterval: 10 });
      }

      // Cards that share the same dependencies
      else if (
        _.intersection(card2.dependencies, card1.dependencies).length > 0
      ) {
        card2_interval = 3;
      }

      // if (card2_interval && card2_interval > card2.absoluteQueuePosition) {
      //   card2.absoluteQueuePosition = card2_interval;
      // }
    });
  });
}
