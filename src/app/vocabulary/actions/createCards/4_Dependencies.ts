import { withDependencies } from "app/vocabulary/actions/functions/dependencies";
import { isDev } from "app/app/functions/isDev";
import { days, minutes } from "app/app/functions/time";
import { isIn, isInSession } from "app/vocabulary/actions/card/card";
import { wasTermSeenMoreRecentlyThan } from "app/vocabulary/actions/card/card_schedule";
import {
  isBad,
  isFairlyBad,
} from "app/vocabulary/actions/card/card_difficulty";
import { CardIds } from "app/vocabulary/actions/card/types";

/* Add bad dependencies */
export default (chosen_cards): CardIds => {
  const after = withDependencies(chosen_cards, { skipSiblings: true }).filter(
    (id) =>
      !isInSession(id) &&
      /* Keep in those already chosen */
      (isIn(id, chosen_cards) ||
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
