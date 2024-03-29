import {
  getLowestBadCardSortKey,
  isEasinessLevelOn,
} from "app/vocabulary/actions/easinessLevel/functions";
import { deck } from "app/vocabulary/actions/deck";
import { veryRecentlySeenSortedLast } from "app/vocabulary/actions/createCards/functions";
import { sortBy } from "underscore";
import {
  clamp,
  maxIgnoreUndef,
  minIgnoreFalsy,
  minIgnoreUndef,
} from "app/app/functions/math";

/**
 * @returns {Card[]}
 */
export default (options) => {
  let new_cards = deck.cards_sorted.filter(
    (card) => !card.isInSchedule() && card.isAllowed()
  );

  if (deck.session.allowed_ids && !options?.dont_sort_by_allowed_ids) {
    /* Sort in same order as allowed_ids */
    new_cards = sortBy(new_cards, (i) =>
      deck.session.allowed_ids.indexOf(i.getId())
    );
  } else if (isEasinessLevelOn()) {
    new_cards = sortBy(new_cards, (i) =>
      i.getSortKeyAdjustedForEasinessLevel()
    );
  } else if (options?.skipOverTheEasiest) {
    /*
      If we are unable to create cards with a given allowed_ids,
      the user does not want to see "Hæ", so we skip over the beginning.
    */
    const lowest = clamp(getLowestBadCardSortKey() || Infinity, 50, 300);
    new_cards = sortBy(new_cards, (i) => i.getSortKeyAdjusted(lowest));
  }

  return veryRecentlySeenSortedLast(new_cards);
};
