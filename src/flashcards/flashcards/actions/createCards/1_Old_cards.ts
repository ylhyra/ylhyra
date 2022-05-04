import { isAllowed } from "flashcards/flashcards/actions/card/card";
import { getCardsInSchedule } from "flashcards/flashcards/actions/card/card_data";
import {
  isBad,
  isBelowGood,
  isTooEasy,
} from "flashcards/flashcards/actions/card/card_difficulty";
import {
  getDue,
  isUnseenSiblingOfANonGoodCard,
  timeSinceTermWasSeen,
  wasTermVeryRecentlySeen,
} from "flashcards/flashcards/actions/card/card_schedule";
import { sortBySortKey } from "flashcards/flashcards/actions/createCards/functions";
import { log } from "modules/log";
import { shuffleLocally } from "modules/shuffleLocally";
import {
  getTimeMemoized,
  hours,
  minutes,
} from "modules/time"; /* Previously seen cards */

/* Previously seen cards */
export const oldCards = () => {
  let overdueGood: CardIds = [];
  let overdueBad: CardIds = [];
  let notOverdueVeryBad: CardIds = [];
  let notOverdue: CardIds = [];

  getCardsInSchedule()
    .filter((id) => isAllowed(id))
    .forEach((id) => {
      /* Overdue */
      if (
        getDue(id) &&
        getDue(id)! < getTimeMemoized() + 16 * hours &&
        !isTooEasy(id) &&
        !wasTermVeryRecentlySeen(id)
      ) {
        if (isBelowGood(id) || isUnseenSiblingOfANonGoodCard(id)) {
          overdueBad.push(id);
        } else {
          overdueGood.push(id);
        }
      }
      // Very bad cards seen more than 20 minutes ago are also added to the overdue pile
      else if (isBad(id) && (timeSinceTermWasSeen(id) || 0) > 20 * minutes) {
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
