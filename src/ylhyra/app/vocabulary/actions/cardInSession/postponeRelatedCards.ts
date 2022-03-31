import {
  dependencyDepthOfCard,
  hasDependenciesInCommonWith,
  hasTermsInCommonWith
} from "ylhyra/app/vocabulary/actions/card/card_dependencies";
import { isBad } from "ylhyra/app/vocabulary/actions/card/card_difficulty";
import { isInSchedule } from "ylhyra/app/vocabulary/actions/card/card_schedule";
import { getSiblingCardsInSession } from "ylhyra/app/vocabulary/actions/card/card_siblings";
import CardInSession from "ylhyra/app/vocabulary/actions/cardInSession/index";
import { BAD, GOOD } from "ylhyra/app/vocabulary/constants";

/**
 * @memberOf CardInSession#
 */
export function postponeRelatedCards(card1interval) {
  const card1: CardInSession = this;

  this.getOtherCardsInSession().forEach((card2: CardInSession) => {
    // Same term
    if (hasTermsInCommonWith(card1.getId(), card2.getId())) {
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
    else if (dependencyDepthOfCard(card2.getId(), card1.getId()) >= 1) {
      let min = dependencyDepthOfCard(card2.getId(), card1.getId()) * 3;
      if (card1.history[0] === BAD) {
        min *= 2;
        if (dependencyDepthOfCard(card2.getId(), card1.getId()) >= 2) {
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
      dependencyDepthOfCard(card1.getId(), card2.getId()) === 1 &&
      // And other card is new
      ((!isInSchedule(card2.getId()) && !card2.hasBeenSeenInSession()) ||
        // Or other card is bad (includes some randomness)
        ((isBad(card2.getId()) || card2.history[0] === BAD) &&
          Math.random() > 0.5))
    ) {
      card1.showIn({ interval: 6 });
      card2.showIn({ interval: 3 });

      getSiblingCardsInSession(card2.getId()).forEach((sibling_card) => {
        sibling_card.showIn({ interval: 6 });
      });
    }

    // Cards that share the same dependencies
    else if (hasDependenciesInCommonWith(card1.getId(), card2.getId())) {
      card2.showIn({ cannotBeShownBefore: 2 });
      // log(`"${printWord(card2.id)}" postponed`);
    }

    // // Overlap in card text (such as in the English translations)
    // else if (isTextSimilarTo(card1.getId(), card2.getId())) {
    //   card2.showIn({ cannotBeShownBefore: 2 });
    //   // log(
    //   //   `"${card2.printWord()}" postponed as it's similar to "${card1.printWord()}"`
    //   // );
    //   // log(card2.phoneticHashArray, card1.phoneticHashArray);
    // }
  });
}
