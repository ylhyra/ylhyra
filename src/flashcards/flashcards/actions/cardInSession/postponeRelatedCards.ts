import {
  dependencyDepthOfCard,
  hasDependenciesInCommonWith,
  hasTermsInCommonWith,
} from "flashcards/flashcards/actions/card/cardDependencies";
import { isBad } from "flashcards/flashcards/actions/card/cardDifficulty";
import { isInSchedule } from "flashcards/flashcards/actions/card/cardSchedule";
import { getSiblingCardsInSession } from "flashcards/flashcards/actions/card/cardSiblings";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { Rating } from "flashcards/flashcards/types/types";

export function postponeRelatedCards(this: CardInSession, card1interval) {
  const card1: CardInSession = this;

  this.getOtherCardsInSession().forEach((card2: CardInSession) => {
    // Same term
    if (hasTermsInCommonWith(card1.getId(), card2.getId())) {
      if (
        card1.history.includes(Rating.BAD) ||
        card2.history.includes(Rating.BAD)
      ) {
        card2.done = false;
      } else {
        card2.done = true;
      }

      if (card1.history[0] >= Rating.GOOD) {
        card2.showIn({ minInterval: 8 });
      } else if (card1.history[0] === Rating.BAD) {
        if (
          card1.history[1] === Rating.BAD &&
          !(card2.history[0] >= Rating.GOOD)
        ) {
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
      if (card1.history[0] === Rating.BAD) {
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
      card1.history[0] === Rating.BAD &&
      dependencyDepthOfCard(card1.getId(), card2.getId()) === 1 &&
      // And other card is new
      ((!isInSchedule(card2.getId()) && !card2.hasBeenSeenInSession()) ||
        // Or other card is bad (includes some randomness)
        ((isBad(card2.getId()) || card2.history[0] === Rating.BAD) &&
          Math.random() > 0.5))
    ) {
      card1.showIn({ interval: 6 });
      card2.showIn({ interval: 3 });

      getSiblingCardsInSession(card2.getId()).forEach((siblingCard) => {
        siblingCard.showIn({ interval: 6 });
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
