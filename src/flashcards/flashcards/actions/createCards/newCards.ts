import { isAllowed } from "flashcards/flashcards/actions/card/card";
import { isInSchedule } from "flashcards/flashcards/actions/card/cardSchedule";
import { CreateCardsOptions } from "flashcards/flashcards/actions/createCards";
import { veryRecentlySeenSortedLast } from "flashcards/flashcards/actions/createCards/functions";
import { getCardIdsFromAllDecks } from "flashcards/flashcards/stores/base/functions";
import { getSession } from "flashcards/flashcards/stores/session";
import { CardIds } from "flashcards/flashcards/types/types";
import { sortBy } from "underscore";

/**
 * Returns ALL new cards
 * Called by {@link chooseCards}, which will choose a few cards from these.
 */
export const getNewCards = (options?: CreateCardsOptions): CardIds => {
  const session = getSession();

  let newCards = getCardIdsFromAllDecks().filter(
    (cardId) => !isInSchedule(cardId) && isAllowed(cardId)
  );

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
