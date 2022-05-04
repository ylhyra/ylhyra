import { isInSession } from "flashcards/flashcards/play/actions/card/card";
import {
  isBad,
  isFairlyBad,
} from "flashcards/flashcards/play/actions/card/card_difficulty";
import { wasTermSeenMoreRecentlyThan } from "flashcards/flashcards/play/actions/card/card_schedule";
import { withDependencies } from "flashcards/flashcards/play/actions/functions/dependencies";
import { isDev } from "modules/isDev";
import { days, minutes } from "modules/time"; /* Add bad dependencies */

/* Add bad dependencies */
export const dependencies = (chosen_cards: CardIds): CardIds => {
  const after = withDependencies(chosen_cards, { skipSiblings: true }).filter(
    (id) =>
      !isInSession(id) &&
      /* Keep in those already chosen */
      (chosen_cards.includes(id) ||
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
