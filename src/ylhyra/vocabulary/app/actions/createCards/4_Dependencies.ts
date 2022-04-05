import { isDev } from "modules/isDev";
import { days, minutes } from "modules/time";
import { isInSession } from "ylhyra/vocabulary/app/actions/card/card";
import {
  isBad,
  isFairlyBad,
} from "ylhyra/vocabulary/app/actions/card/card_difficulty";
import { wasTermSeenMoreRecentlyThan } from "ylhyra/vocabulary/app/actions/card/card_schedule";
import { CardIds } from "ylhyra/vocabulary/app/actions/card/types";
import { withDependencies } from "ylhyra/vocabulary/app/actions/functions/dependencies";

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
