import { insertDependenciesInCorrectOrder } from "app/vocabulary/actions/functions/dependencies";
import { getLowestBadCardSortKey } from "app/vocabulary/actions/easinessLevel/functions";

export default (chosen_cards) => {
  const lowestBadCardSortKey = getLowestBadCardSortKey();
  const lowestSortKeyOfChosenCards = Math.min(
    ...chosen_cards.map((c) => c.sortKey)
  );
  return insertDependenciesInCorrectOrder(chosen_cards).filter(
    (card) =>
      card.isAllowed() &&
      /* Keep in those already chosen */
      (card.isIn(chosen_cards) ||
        /* Include bad dependencies */
        card.isFairlyBad() ||
        /* And dependencies that are not well known and close
           to the difficulty level of the chosen cards */
        (card.isTermUnknownOrNotGood() &&
          (card.sortKey >= lowestBadCardSortKey ||
            card.sortKey >= lowestSortKeyOfChosenCards - 200)))
  );
};
