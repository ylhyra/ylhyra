import { isAllowed } from "flashcards/flashcards/actions/card/card";
import { isInSchedule } from "flashcards/flashcards/actions/card/card_schedule";
import { veryRecentlySeenSortedLast } from "flashcards/flashcards/actions/createCards/functions";
import { CreateCardsOptions } from "flashcards/flashcards/actions/createCards/index";
import { getSession } from "flashcards/flashcards/sessionStore";
import { sortBy } from "underscore";

export const getNewCards = (options?: CreateCardsOptions): CardIds => {
  const session = getSession();

  let newCards = session
    .getCardIdsFromAllowedDecks()
    .filter((cardId) => !isInSchedule(cardId) && isAllowed(cardId));

  /**
   * TODO! Sorting based on simplicity
   */

  if (session.allowedIds && !options?.dontSortByAllowedIds) {
    /* Sort in same order as allowedIds */
    newCards = sortBy(newCards, (id) => session.allowedIds!.indexOf(id));
  } else if (options?.skipOverTheEasiest) {
    // /*
    //   If we are unable to create cards with a given allowedIds,
    //   the user does not want to see "Hæ", so we skip over the beginning.
    // */
    // const lowest = clamp(getLowestBadCardSortKey() || Infinity, 50, 300);
    // new_cards = sortBy(new_cards, (i) => i.getSortKeyAdjusted(lowest));
  }

  return veryRecentlySeenSortedLast(newCards.slice(0, 200));
};
