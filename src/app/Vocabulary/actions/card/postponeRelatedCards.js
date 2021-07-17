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
        let max;
        if (
          (card2.score && card2.score < GOOD) ||
          card1.history.includes(BAD) ||
          card2.history.includes(BAD)
        ) {
          max = 10;
          card2.done = false;
        } else {
          max = 500;
          card2.done = true;
        }
        if (card1.history[0] === BAD && card1.history[1] === BAD) {
          card2.showIn({ interval: 3 });
          card1.showIn({ interval: 4 });
        } else if (card1.history[0] === BAD) {
          card2.showIn({ interval: 4 });
        } else if (card2.history[0] === BAD && card1.history[0] !== BAD) {
          card2.showIn({ minInterval: 8 });
        } else {
          card2.showIn({ minInterval: Math.min(card1_interval, max) });
        }
      }

      // Cards that directly rely on this card
      else if (Object.keys(card2.dependencyDepth).includes(card1.id)) {
        const min =
          (card1.history[0] === BAD ? 5 : 2) +
          card2.dependencyDepth[card1.id] * 3;
        card2.showIn({
          minInterval: min,
          cannotBeShownBefore: min,
        });
      }

      // Cards that this card depends directly on
      else if (
        card1.history[0] === BAD &&
        Object.keys(card1.dependencyDepth).includes(card2.id) &&
        card1.dependencyDepth[card2.id] === 1 &&
        (card2.score < 1.1 || card2.history[0] === BAD) &&
        Math.random() > 0.3
      ) {
        card1.showIn({ interval: 6 });
        card2.showIn({ interval: 3 });
      }

      // Cards that share the same dependencies
      else if (
        _.intersection(
          Object.keys(card1.dependencyDepth),
          Object.keys(card2.dependencyDepth)
        ).length > 0
      ) {
        card2.showIn({ cannotBeShownBefore: 2 });
      }
    });
  });
}
