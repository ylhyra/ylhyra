import {getCardsInSchedule} from "flashcards/flashcards/actions/card/functions";
import {sortBySortKey} from "flashcards/flashcards/actions/createCards/functions";
import {CardIds} from "flashcards/flashcards/types/types";
import {log} from "modules/log";
import {shuffleLocally} from "modules/shuffleLocally";
import {getTimeMemoized, hours, minutes} from "modules/time";

/**
 * Returns ALL cards that have previously been seen.
 * Called by {@link chooseCards}, which will choose a few cards from these.
 */
export const oldCards = () => {
  let overdueGood: CardIds = [];
  let overdueBad: CardIds = [];
  let notOverdueVeryBad: CardIds = [];
  let notOverdue: CardIds = [];

  getCardsInSchedule()
    .filter((id) => id.isAllowed())
    .forEach((id) => {
      /* Overdue */
      if (
        id.getDue() &&
        id.getDue()! < getTimeMemoized() + 16 * hours &&
        !id.isTooEasy() &&
        !id.wasRowVeryRecentlySeen()
      ) {
        if (id.isBelowGood() || id.isUnseenSiblingOfANonGoodCard()) {
          overdueBad.push(id);
        } else {
          overdueGood.push(id);
        }
      }
      // Very bad cards seen more than 20 minutes ago are also added to the overdue pile
      else if (id.isBad() && (id.timeSinceRowWasSeen() || 0) > 20 * minutes) {
        notOverdueVeryBad.push(id);
      } else {
        notOverdue.push(id);
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
};
