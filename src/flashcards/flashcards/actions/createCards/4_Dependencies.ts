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

/* Add bad dependencies */
export const dependencies = (chosenCards: CardIds): CardIds => {
  const after = withDependencies(chosenCards, { skipSiblings: true }).filter(
    (id) =>
      !isInSession(id) &&
      /* Keep in those already chosen */
      (chosenCards.includes(id) ||
        (isBad(id) && wasTermSeenMoreRecentlyThan(id, 45 * minutes)) ||
        (isFairlyBad(id) && wasTermSeenMoreRecentlyThan(id, 2 * days)))
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
