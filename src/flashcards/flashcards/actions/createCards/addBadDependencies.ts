import { isInSession } from "flashcards/flashcards/actions/card/card";
import {
  isBad,
  isFairlyBad,
} from "flashcards/flashcards/actions/card/cardDifficulty";
import { wasTermSeenMoreRecentlyThan } from "flashcards/flashcards/actions/card/cardSchedule";
import { withDependencies } from "flashcards/flashcards/actions/functions/dependencies";
import { CardIds } from "flashcards/flashcards/types/types";
import { isDev } from "modules/isDev";
import { days, minutes } from "modules/time";

export const addBadDependencies = (chosenCards: CardIds): CardIds => {
  console.warn("dependencies not implemented");
  return chosenCards;

  const after = withDependencies(chosenCards, { skipSiblings: true }).filter(
    (cardId) =>
      !isInSession(cardId) &&
      /* Keep in those already chosen */
      (chosenCards.includes(cardId) ||
        (isBad(cardId) && wasTermSeenMoreRecentlyThan(cardId, 45 * minutes)) ||
        (isFairlyBad(cardId) && wasTermSeenMoreRecentlyThan(cardId, 2 * days)))
  );

  if (isDev) {
    // if (after.length !== chosen_cards.length) {
    //   log(
    //     `Dependencies added, before:\n${chosen_cards
    //       .map((card) => card.printWord())
    //       .join(", ")}\nafter:\n${after
    //       .map((card) =>
    //         card.isIn(chosen_cards)
    //           ? card.printWord()
    //           : "<<<" + card.printWord() + ">>>"
    //       )
    //       .join(", ")}`
    //   );
    // }
  }
  return after;
};
