import { withDependencies } from "ylhyra/app/vocabulary/actions/functions/dependencies";
import { isDev } from "modules/isDev";
import { days, minutes } from "ylhyra/app/app/functions/time";
import { isInSession } from "ylhyra/app/vocabulary/actions/card/card";
import { wasTermSeenMoreRecentlyThan } from "ylhyra/app/vocabulary/actions/card/card_schedule";
import {
  isBad,
  isFairlyBad,
} from "ylhyra/app/vocabulary/actions/card/card_difficulty";
import { CardIds } from "ylhyra/app/vocabulary/actions/card/types";

/* Add bad dependencies */
export default (chosen_cards: CardIds): CardIds => {
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
