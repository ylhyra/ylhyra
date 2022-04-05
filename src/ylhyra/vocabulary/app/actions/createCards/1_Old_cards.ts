import { log } from "modules/log";
import { shuffleLocally } from "modules/shuffleLocally";
import { getTimeMemoized, hours, minutes } from "modules/time";
import { isAllowed } from "ylhyra/vocabulary/app/actions/card/card";
import { getCardsInSchedule } from "ylhyra/vocabulary/app/actions/card/card_data";
import {
  isBad,
  isBelowGood,
  isTooEasy,
} from "ylhyra/vocabulary/app/actions/card/card_difficulty";
import {
  getDue,
  isUnseenSiblingOfANonGoodCard,
  timeSinceTermWasSeen,
  wasTermVeryRecentlySeen,
} from "ylhyra/vocabulary/app/actions/card/card_schedule";
import { CardIds } from "ylhyra/vocabulary/app/actions/card/types";
import { sortBySortKey } from "ylhyra/vocabulary/app/actions/createCards/functions";

/* Previously seen cards */
export default () => {
  let overdue_good: CardIds = [];
  let overdue_bad: CardIds = [];
  let not_overdue_very_bad: CardIds = [];
  let not_overdue: CardIds = [];

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
          overdue_bad.push(id);
        } else {
          overdue_good.push(id);
        }
      }
      // Very bad cards seen more than 20 minutes ago are also added to the overdue pile
      else if (isBad(id) && (timeSinceTermWasSeen(id) || 0) > 20 * minutes) {
        not_overdue_very_bad.push(id);
      } else {
        not_overdue.push(id);
      }
    });

  log({
    "Overdue good": overdue_good.length,
    "Overdue bad": overdue_bad.length,
    "Not overdue very bad": not_overdue_very_bad.length,
  });

  return {
    overdueBad: shuffleLocally(
      sortBySortKey(overdue_bad.concat(not_overdue_very_bad))
    ),
    overdueGood: shuffleLocally(sortBySortKey(overdue_good)),
    notOverdue: not_overdue,
  };
};
