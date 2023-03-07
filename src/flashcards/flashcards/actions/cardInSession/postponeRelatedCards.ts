import {
  dependencyDepthOfCard,
  hasDependenciesInCommonWith,
} from "flashcards/flashcards/actions/card/cardDependencies";
import { isNewRow } from "flashcards/flashcards/actions/card/cardSchedule";
import { isBad } from "flashcards/flashcards/actions/card/cardDifficulty";
import { getSiblingCardsInSession } from "flashcards/flashcards/actions/card/cardSiblings";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { Rating } from "flashcards/flashcards/types";

export function postponeRelatedCards(
  this: CardInSession,
  card1interval: number,
) {
  const card1: CardInSession = this;

  this.getOtherCardsInSession().forEach((card2: CardInSession) => {
    // Same row
    if (card1.rowId === card2.rowId) {
      if (
        card1.ratingHistory.includes(Rating.BAD) ||
        card2.ratingHistory.includes(Rating.BAD)
      ) {
        card2.done = false;
      } else {
        card2.done = true;
      }

      if (card1.lastRating >= Rating.GOOD) {
        card2.showIn({ minInterval: 8 });
      } else if (card1.lastRating === Rating.BAD) {
        if (
          card1.nextLastRating === Rating.BAD &&
          !(card2.lastRating >= Rating.GOOD)
        ) {
          card1.showIn({ interval: card1interval + 1 });
          card2.showIn({ interval: card1interval });
        } else {
          card2.showIn({ interval: card1interval });
        }
      }
    }

    // Cards that directly rely on this card
    else if (dependencyDepthOfCard(card2, card1) >= 1) {
      let min = dependencyDepthOfCard(card2, card1) * 3;
      if (card1.lastRating === Rating.BAD) {
        min *= 2;
        if (dependencyDepthOfCard(card2, card1) >= 2) {
          card2.done = true;
        }
      }
      card2.showIn({
        minInterval: min,
        cannotBeShownUntilInterval: min,
      });
    }

    // Cards that this card depends directly on
    else if (
      card1.lastRating === Rating.BAD &&
      dependencyDepthOfCard(card1, card2) === 1 &&
      // And other card is new
      ((!isNewRow(card2) && !card2.hasBeenSeenInSession) ||
        // Or other card is bad (includes some randomness)
        ((isBad(card2) || card2.lastRating === Rating.BAD) &&
          Math.random() > 0.5))
    ) {
      card1.showIn({ interval: 6 });
      card2.showIn({ interval: 3 });

      getSiblingCardsInSession(card2).forEach((siblingCard) => {
        siblingCard.showIn({ interval: 6 });
      });
    }

    // Cards that share the same dependencies
    else if (hasDependenciesInCommonWith(card1, card2)) {
      card2.showIn({ cannotBeShownUntilInterval: 2 });
      // log(`"${printWord(card2.id)}" postponed`);
    }

    // // Overlap in card text (such as in the English translations)
    // else if (isTextSimilarTo(card1.id, card2.id)) {
    //   card2.showIn({ cannotBeShownUntil: 2 });
    //   // log(
    //   //   `"${printWord(card2,)}" postponed as it's similar to "${printWord(card1,)}"`
    //   // );
    //   // log(card2.phoneticHashArray, card1.phoneticHashArray);
    // }
  });
}
