import { BAD, GOOD } from "app/vocabulary/actions/card";
import _ from "underscore";
import { printWord } from "app/vocabulary/actions/functions";

/**
 * @module Card
 */
export default function postponeRelatedCards(card1interval) {
  const card1 = this;
  console.log({ card1 });

  card1.session.cards.forEach((card2) => {
    if (card2.id === card1.id) return;

    // Same term
    if (_.intersection(card1.terms, card2.terms).length > 0) {
      if (card1.history.includes(BAD) || card2.history.includes(BAD)) {
        card2.done = false;
      } else {
        card2.done = true;
      }

      if (card1.history[0] >= GOOD) {
        card2.showIn({ minInterval: 8 });
      } else if (card1.history[0] === BAD) {
        if (card1.history[1] === BAD && !(card2.history[0] >= GOOD)) {
          card1.showIn({ interval: card1interval + 1 });
          card2.showIn({ interval: card1interval });
        } else {
          card2.showIn({ interval: card1interval });
        }
      }
    }

    // Cards that directly rely on this card
    else if (Object.keys(card2.dependenciesAndSameTerm).includes(card1.id)) {
      const min =
        (card1.history[0] === BAD ? 5 : 2) +
        card2.dependenciesAndSameTerm[card1.id] * 3;
      card2.showIn({
        minInterval: min,
        cannotBeShownBefore: min,
      });
    }

    // Cards that this card depends directly on
    else if (
      card1.history[0] === BAD &&
      Object.keys(card1.dependenciesAndSameTerm).includes(card2.id) &&
      card1.dependenciesAndSameTerm[card2.id] === 1 &&
      (card2.getScore() < 1.1 || card2.history[0] === BAD) &&
      Math.random() > 0.3
    ) {
      card1.showIn({ interval: 6 });
      card2.showIn({ interval: 3 });
    }

    // Cards that share the same dependencies
    else if (
      _.intersection(
        Object.keys(card1.dependenciesAndSameTerm),
        Object.keys(card2.dependenciesAndSameTerm)
      ).length > 0
    ) {
      card2.showIn({ cannotBeShownBefore: 2 });
      // console.log(`"${printWord(card2.id)}" postponed`);
    } else {
      // console.log(`NOT POSTPONED "${printWord(card2.id)}"`);
    }
  });
}
