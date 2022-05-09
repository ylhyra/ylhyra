import {
  dependencyDepthOfCard,
  hasDependenciesInCommonWith,
  hasTheSameTermAs,
} from "flashcards/flashcards/actions/card/cardDependencies";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { Rating } from "flashcards/flashcards/types/types";

export function postponeRelatedCards(
  this: CardInSession,
  card1interval: number
) {
  const card1: CardInSession = this;

  this.getOtherCardsInSession().forEach((card2: CardInSession) => {
    // Same term
    if (hasTheSameTermAs(card1.cardId, card2.cardId)) {
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
    else if (dependencyDepthOfCard(card2.cardId, card1.cardId) >= 1) {
      let min = dependencyDepthOfCard(card2.cardId, card1.cardId) * 3;
      if (card1.history[0] === Rating.BAD) {
        min *= 2;
        if (dependencyDepthOfCard(card2.cardId, card1.cardId) >= 2) {
          card2.done = true;
        }
      }
      card2.showIn({
        minInterval: min,
        cannotBeShownBeforeInterval: min,
      });
    }

    // Cards that this card depends directly on
    else if (
      card1.history[0] === Rating.BAD &&
      dependencyDepthOfCard(card1.cardId, card2.cardId) === 1 &&
      // And other card is new
      ((!card2.isInSchedule() && !card2.hasBeenSeenInSession()) ||
        // Or other card is bad (includes some randomness)
        ((card2.isBad() || card2.history[0] === Rating.BAD) &&
          Math.random() > 0.5))
    ) {
      card1.showIn({ interval: 6 });
      card2.showIn({ interval: 3 });

      card2.getSiblingCardsInSession().forEach((siblingCard) => {
        siblingCard.showIn({ interval: 6 });
      });
    }

    // Cards that share the same dependencies
    else if (hasDependenciesInCommonWith(card1.cardId, card2.cardId)) {
      card2.showIn({ cannotBeShownBeforeInterval: 2 });
      // log(`"${printWord(card2.id)}" postponed`);
    }

    // // Overlap in card text (such as in the English translations)
    // else if (isTextSimilarTo(card1.id, card2.id)) {
    //   card2.showIn({ cannotBeShownBefore: 2 });
    //   // log(
    //   //   `"${card2.printWord()}" postponed as it's similar to "${card1.printWord()}"`
    //   // );
    //   // log(card2.phoneticHashArray, card1.phoneticHashArray);
    // }
  });
}
