import { isInSession } from "flashcards/flashcards/actions/card/card";
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
        (cardId.isBad() && cardId.wasTermSeenMoreRecentlyThan(45 * minutes)) ||
        (cardId.isFairlyBad() && cardId.wasTermSeenMoreRecentlyThan(2 * days)))
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
