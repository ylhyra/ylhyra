import { withDependencies } from "app/vocabulary/actions/functions/dependencies";
import { getLowestBadCardSortKey } from "app/vocabulary/actions/easinessLevel/functions";

export const DEPENDENCIES_CAN_BE_X_LOWER_THAN_EASINESS_LEVEL = 200;

export default (chosen_cards) => {
  const lowestBadCardSortKey = getLowestBadCardSortKey();
  const lowestSortKeyOfChosenCards = Math.min(
    ...chosen_cards.map((c) => c.sortKey)
  );
  return withDependencies(chosen_cards).filter(
    (card) =>
      !card.isInSession() &&
      /* Keep in those already chosen */
      (card.isIn(chosen_cards) ||
        (!card.wasTermVeryRecentlySeen() &&
          /* Include bad dependencies */
          (card.isFairlyBad() ||
            /* And dependencies that are not well known and close
           to the difficulty level of the chosen cards */
            (card.isTermUnknownOrNotGood() &&
              (card.sortKey >= lowestBadCardSortKey ||
                card.sortKey >=
                  lowestSortKeyOfChosenCards -
                    DEPENDENCIES_CAN_BE_X_LOWER_THAN_EASINESS_LEVEL)))))
  );
};
