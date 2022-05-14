import { Card } from "flashcards/flashcards/actions/card/card";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { isBrowser } from "modules/isBrowser";
import { getTimeMemoized, hours, minutes } from "modules/time";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

/**
 * Returns ALL cards allowed in the session.
 * Called by {@link chooseCards}, which will choose a few cards from these.
 */
export const classifyCards = () => {
  return warnIfFunctionIsSlow.wrap(() => {
    let overdueGood: Card[] = [];
    let overdueBad: Card[] = [];
    let notOverdueVeryBad: Card[] = [];
    let notOverdue: Card[] = [];
    let newCards: Card[] = [];

    getSession()
      .getAllCardsThatCouldBeInSession()
      .filter((card) => card.isAllowed())
      .forEach((card) => {
        if (!card.isInSchedule()) {
          newCards.push(card);
        }

        // Overdue
        else if (
          card.isOverdue(getTimeMemoized() + 16 * hours) &&
          !card.isTooEasy() &&
          !card.wasRowVeryRecentlySeen()
        ) {
          if (card.isBelowGood() || card.isUnseenSiblingOfANonGoodCard()) {
            overdueBad.push(card);
          } else {
            overdueGood.push(card);
          }
        }

        // Very bad cards seen more than 20 minutes ago are also added to the overdue pile
        else if (
          card.isBad() &&
          (card.timeSinceRowWasSeen() || 0) > 20 * minutes
        ) {
          return notOverdueVeryBad.push(card);
        } else {
          notOverdue.push(card);
        }
      });

    // log({
    //   "Overdue good": overdueGood.length,
    //   "Overdue bad": overdueBad.length,
    //   "Not overdue very bad": notOverdueVeryBad.length,
    // });

    // return {
    //   overdueBad: shuffleLocally(
    //     /** what???? this concatenation may be wrong, should be interspersed instead */
    //     sortBySortKey(overdueBad.concat(notOverdueVeryBad))
    //   ),
    //   overdueGood: shuffleLocally(sortBySortKey(overdueGood)),
    //   newCards: sortNewCards(newCards),
    //   notOverdue,
    // };
    return {
      /** TODO: Verify */
      overdueBad: overdueBad.concat(notOverdueVeryBad),
      overdueGood,
      newCards,
      notOverdue,
    };
  });
};

export const sortNewCards = (newCards: Card[]) => {
  const session = getSession();
  // if (session.allowedCards /*&& !options?.dontSortByAllowedCards*/) {
  //   /* Sort in same order as allowedCards */
  //   newCards = sortBy(newCards, (id) => session.allowedCards!.indexOf(id));
  // } else if (options?.skipOverTheEasiest) {
  //   // /*
  //   //   If we are unable to create cards with a given allowedCards,
  //   //   the user does not want to see "Hæ", so we skip over the beginning.
  //   // */
  //   // const lowest = clamp(getLowestBadCardSortKey() || Infinity, 50, 300);
  //   // new_cards = sortBy(new_cards, (i) => i.getSortKeyAdjusted(lowest));
  // }
  isBrowser && console.warn("Sorting of new cards not implemented");
  // return veryRecentlySeenSortedLast(newCards.slice(0, 200));
  return newCards;
};
