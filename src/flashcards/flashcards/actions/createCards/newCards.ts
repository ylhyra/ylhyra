import { Card } from "flashcards/flashcards/actions/card/card";
import { CreateCardsOptions } from "flashcards/flashcards/actions/createCards";
import { veryRecentlySeenSortedLast } from "flashcards/flashcards/actions/createCards/functions";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { sortBy } from "underscore";

/**
 * Returns ALL new cards
 * Called by {@link chooseCards}, which will choose a few cards from these.
 */
export const getNewCards = (options?: CreateCardsOptions): Card[] => {
  const session = getSession();

  let newCards = getCardsFromAllDecks().filter(
    (card) => !card.isInSchedule() && card.isAllowed()
  );

  /**
   * TODO! Sorting based on simplicity
   */

  if (session.allowedCards && !options?.dontSortByallowedCards) {
    /* Sort in same order as allowedCards */
    newCards = sortBy(newCards, (id) => session.allowedCards!.indexOf(id));
  } else if (options?.skipOverTheEasiest) {
    // /*
    //   If we are unable to create cards with a given allowedCards,
    //   the user does not want to see "Hæ", so we skip over the beginning.
    // */
    // const lowest = clamp(getLowestBadCardSortKey() || Infinity, 50, 300);
    // new_cards = sortBy(new_cards, (i) => i.getSortKeyAdjusted(lowest));
  }

  return veryRecentlySeenSortedLast(newCards.slice(0, 200));
};
