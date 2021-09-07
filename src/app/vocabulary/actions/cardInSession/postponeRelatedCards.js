import { log } from "app/app/functions/log";
import { BAD, GOOD } from "app/vocabulary/actions/cardInSession";
import _ from "underscore";
import { getCardsInSession } from "app/vocabulary/actions/session/functions";

/**
 * @module CardInSession
 */
export default function postponeRelatedCards(card1interval) {
  const card1 = this;

  this.getOtherCardsInSession().forEach((card2) => {
    // Same term
    if (card1.hasTermsInCommonWith(card2)) {
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
    else if (card2.getDependenciesAsArrayOfCards().includes(card1.getId())) {
      const min =
        (card1.history[0] === BAD ? 5 : 2) +
        card2.dependencyDepthOfCard(card1) * 3;
      card2.showIn({
        minInterval: min,
        cannotBeShownBefore: min,
      });
    }

    // Cards that this card depends directly on
    else if (
      card1.history[0] === BAD &&
      card1.dependencyDepthOfCard(card2) === 1 &&
      // And other card is new
      ((!card2.isInSchedule() && !card2.wasSeenInSession()) ||
        // Or other card is bad (includes some randomness
        ((card2.isBad || card2.history[0] === BAD) && Math.random() > 0.5))
    ) {
      card1.showIn({ interval: 6 });
      card2.showIn({ interval: 3 });
    }

    // Cards that share the same dependencies
    else if (
      _.intersection(
        card1.getDependenciesAsArrayOfCards(),
        card2.getDependenciesAsArrayOfCards()
      ).length > 0
    ) {
      card2.showIn({ cannotBeShownBefore: 2 });
      // log(`"${printWord(card2.id)}" postponed`);
    } else {
      // log(`NOT POSTPONED "${printWord(card2.id)}"`);
    }
  });
}
