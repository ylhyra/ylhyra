// import { isEasinessLevelOn } from "app/vocabulary/actions/easinessLevel/functions";
import { isAllowed } from "flashcards/flashcards/play/actions/card/card";
import { isInSchedule } from "flashcards/flashcards/play/actions/card/card_schedule";
import { CreateCardsOptions } from "flashcards/flashcards/play/actions/createCards";
import { veryRecentlySeenSortedLast } from "flashcards/flashcards/play/actions/createCards/functions";
import { deck } from "flashcards/flashcards/play/actions/deck";
import { sortBy } from "underscore";
import { sortBy } from "underscore";

export default (options?: CreateCardsOptions): CardIds => {
  let newCards = deck!.cards_sorted.filter(
    (card) => !isInSchedule(card) && isAllowed(card)
  );

  if (deck!.session.allowedIds && !options?.dont_sort_by_allowedIds) {
    /* Sort in same order as allowedIds */
    newCards = sortBy(newCards, (id) => deck!.session.allowedIds!.indexOf(id));
  }
  // else if (isEasinessLevelOn()) {
  //   new_cards = sortBy(new_cards, (i) =>
  //     i.getSortKeyAdjustedForEasinessLevel()
  //   );
  // }
  else if (options?.skipOverTheEasiest) {
    // todo!!!
    // /*
    //   If we are unable to create cards with a given allowedIds,
    //   the user does not want to see "Hæ", so we skip over the beginning.
    // */
    // const lowest = clamp(getLowestBadCardSortKey() || Infinity, 50, 300);
    // new_cards = sortBy(new_cards, (i) => i.getSortKeyAdjusted(lowest));
  }

  return veryRecentlySeenSortedLast(newCards.slice(0, 200));
};
