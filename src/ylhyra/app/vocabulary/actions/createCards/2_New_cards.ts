// import { isEasinessLevelOn } from "app/vocabulary/actions/easinessLevel/functions";
import { sortBy } from "underscore";
import { isAllowed } from "ylhyra/app/vocabulary/actions/card/card";
import { isInSchedule } from "ylhyra/app/vocabulary/actions/card/card_schedule";
import { CardIds } from "ylhyra/app/vocabulary/actions/card/types";
import { veryRecentlySeenSortedLast } from "ylhyra/app/vocabulary/actions/createCards/functions";
import { deck } from "ylhyra/app/vocabulary/actions/deck";

export default (options): CardIds => {
  let newCards = deck!.cards_sorted.filter(
    (card) => !isInSchedule(card) && isAllowed(card)
  );

  if (deck!.session.allowed_ids && !options?.dont_sort_by_allowed_ids) {
    /* Sort in same order as allowed_ids */
    newCards = sortBy(newCards, (id) => deck!.session.allowed_ids.indexOf(id));
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

  return veryRecentlySeenSortedLast(newCards.slice(0, 200));
};
