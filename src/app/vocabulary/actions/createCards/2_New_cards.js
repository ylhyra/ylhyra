import { isEasinessLevelOn } from "app/vocabulary/actions/easinessLevel/functions";
import { deck } from "app/vocabulary/actions/deck";
import { veryRecentlySeenSortedLast } from "app/vocabulary/actions/createCards/functions";
import { sortBy } from "app/app/functions/sortBy";

/**
 * @returns {Card[]}
 */
export default () => {
  let new_cards = deck.cards_sorted.filter(
    (card) => !card.isInSchedule() && card.isAllowed()
  );

  if (deck.session.allowed_ids) {
    /* Sort in same order as allowed_ids */
    new_cards = sortBy(new_cards, (i) =>
      deck.session.allowed_ids.indexOf(i.getId())
    );
  } else if (isEasinessLevelOn()) {
    new_cards = sortBy(new_cards, (i) =>
      i.getSortKeyAdjustedForEasinessLevel()
    );
  }

  return new_cards |> veryRecentlySeenSortedLast;
};
