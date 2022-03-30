import { isAllowed } from "app/vocabulary/actions/card/card";
import { isInSchedule } from "app/vocabulary/actions/card/card_schedule";
import { CardIds } from "app/vocabulary/actions/card/types";
import { veryRecentlySeenSortedLast } from "app/vocabulary/actions/createCards/functions";
import { deck } from "app/vocabulary/actions/deck";
// import { isEasinessLevelOn } from "app/vocabulary/actions/easinessLevel/functions";
import { sortBy } from "underscore";

export default (options): CardIds => {
  let new_cards = deck.cards_sorted.filter(
    (card) => !isInSchedule(card) && isAllowed(card)
  );

  if (deck.session.allowed_ids && !options?.dont_sort_by_allowed_ids) {
    /* Sort in same order as allowed_ids */
    new_cards = sortBy(new_cards, (i) =>
      deck.session.allowed_ids.indexOf(i.getId())
    );
  }
  // else if (isEasinessLevelOn()) {
  //   new_cards = sortBy(new_cards, (i) =>
  //     i.getSortKeyAdjustedForEasinessLevel()
  //   );
  // }
  else if (options?.skipOverTheEasiest) {
    // todo!!!
    // /*
    //   If we are unable to create cards with a given allowed_ids,
    //   the user does not want to see "Hæ", so we skip over the beginning.
    // */
    // const lowest = clamp(getLowestBadCardSortKey() || Infinity, 50, 300);
    // new_cards = sortBy(new_cards, (i) => i.getSortKeyAdjusted(lowest));
  }

  return veryRecentlySeenSortedLast(new_cards.slice(0, 200));
};
