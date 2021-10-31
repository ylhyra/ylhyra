import { withDependencies } from "app/vocabulary/actions/functions/dependencies";
import { isDev } from "app/app/functions/isDev";
import { log } from "app/app/functions/log";
import { days, minutes } from "app/app/functions/time";

/* Add bad dependencies */
export default (chosen_cards) => {
  const after = withDependencies(chosen_cards, { skipSiblings: true }).filter(
    (card) =>
      !card.isInSession() &&
      /* Keep in those already chosen */
      (card.isIn(chosen_cards) ||
        (card.isBad() && card.wasTermSeenMoreRecentlyThan(45 * minutes)) ||
        (card.isFairlyBad() && card.wasTermSeenMoreRecentlyThan(2 * days)))
  );

  if (isDev) {
    if (after.length !== chosen_cards.length) {
      log(
        `Dependencies added, before:\n${chosen_cards
          .map((card) => card.printWord())
          .join(", ")}\nafter:\n${after
          .map((card) =>
            card.isIn(chosen_cards)
              ? card.printWord()
              : "<<<" + card.printWord() + ">>>"
          )
          .join(", ")}`
      );
    }
  }
  return after;
};
