import { withDependencies } from "app/vocabulary/actions/functions/dependencies";
import { getLowestBadCardSortKey } from "app/vocabulary/actions/easinessLevel/functions";

export default ({ chosen_cards, forbidden_ids }) => {
  const lowestBadCardSortKey = getLowestBadCardSortKey();
  const lowestSortKeyOfChosenCards = Math.min(
    ...chosen_cards.map((c) => c.sortKey)
  );
  return withDependencies(chosen_cards).filter(
    (card) =>
      card.isAllowed({ forbidden_ids }) &&
      /* Keep in those already chosen */
      (chosen_cards.some((i) => i.getId() === card.getId()) ||
        /* Include bad dependencies */
        card.isFairlyBad() ||
        /* And dependencies that are not well known and semi-close
           to the difficulty level of the chosen cards */
        (card.isTermUnknownOrNotGood() &&
          (card.sortKey >= lowestBadCardSortKey ||
            card.sortKey >= lowestSortKeyOfChosenCards - 100)))
  );
};
// /* Ignore cards that are below user's easiness level */
// !card.isBelowEasinessLevel() &&
