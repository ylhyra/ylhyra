import { BAD, GOOD } from "app/vocabulary/actions/cardInSession";

/**
 * @memberOf CardInSession#
 */
export function postponeRelatedCards(card1interval) {
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
    else if (card2.dependencyDepthOfCard(card1) >= 1) {
      let min = card2.dependencyDepthOfCard(card1) * 3;
      if (card1.history[0] === BAD) {
        min *= 2;
        if (card2.dependencyDepthOfCard(card1) >= 2) {
          card2.done = true;
        }
      }
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
      ((!card2.isInSchedule() && !card2.hasBeenSeenInSession()) ||
        // Or other card is bad (includes some randomness)
        ((card2.isBad() || card2.history[0] === BAD) && Math.random() > 0.5))
    ) {
      card1.showIn({ interval: 6 });
      card2.showIn({ interval: 3 });
    }

    // Cards that share the same dependencies
    else if (card1.hasDependenciesInCommonWith(card2)) {
      card2.showIn({ cannotBeShownBefore: 2 });
      // log(`"${printWord(card2.id)}" postponed`);
    }

    // Overlap in card text (such as in the English translations)
    else if (card1.isTextSimilarTo(card2)) {
      card2.showIn({ cannotBeShownBefore: 2 });
      // log(
      //   `"${card2.printWord()}" postponed as it's similar to "${card1.printWord()}"`
      // );
      // log(card2.phoneticHashArray, card1.phoneticHashArray);
    }
  });
}
