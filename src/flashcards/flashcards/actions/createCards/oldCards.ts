import { Card } from "flashcards/flashcards/actions/card/card";
import { sortBySortKey } from "flashcards/flashcards/actions/createCards/_functions";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { log } from "modules/log";
import { shuffleLocally } from "modules/shuffleLocally";
import { getTimeMemoized, hours, minutes } from "modules/time";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

/**
 * Returns ALL cards that have previously been seen.
 * Called by {@link chooseCards}, which will choose a few cards from these.
 */
export const oldCards = () => {
  return warnIfFunctionIsSlow.wrap(() => {
    let overdueGood: Card[] = [];
    let overdueBad: Card[] = [];
    let notOverdueVeryBad: Card[] = [];
    let notOverdue: Card[] = [];

    getSession()
      .getAllCardsThatCouldBeInSession()
      .filter((card) => card.isInSchedule() && card.isAllowed())
      .forEach((card) => {
        /* Overdue */
        if (
          card.getDue() &&
          card.getDue()! < getTimeMemoized() + 16 * hours &&
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
          notOverdueVeryBad.push(card);
        } else {
          notOverdue.push(card);
        }
      });

    log({
      "Overdue good": overdueGood.length,
      "Overdue bad": overdueBad.length,
      "Not overdue very bad": notOverdueVeryBad.length,
    });

    return {
      overdueBad: shuffleLocally(
        sortBySortKey(overdueBad.concat(notOverdueVeryBad))
      ),
      overdueGood: shuffleLocally(sortBySortKey(overdueGood)),
      notOverdue,
    };
  });
};
