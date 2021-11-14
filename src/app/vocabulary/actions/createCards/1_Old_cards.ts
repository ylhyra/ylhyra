import { getTimeMemoized, hours, minutes } from "app/app/functions/time";
import { sortBySortKey } from "app/vocabulary/actions/createCards/functions";
import { shuffleLocally } from "app/app/functions/shuffleLocally";
import { isAllowed } from "app/vocabulary/actions/card/card";
import { log } from "app/app/functions/log";
import { getCardsInSchedule } from "app/vocabulary/actions/card/card_data";
import {
  getDue,
  isUnseenSiblingOfANonGoodCard,
  timeSinceTermWasSeen,
  wasTermVeryRecentlySeen,
} from "app/vocabulary/actions/card/card_schedule";
import {
  isBad,
  isBelowGood,
  isTooEasy,
} from "app/vocabulary/actions/card/card_difficulty";
import { CardIds } from "app/vocabulary/actions/card/types";

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
        getDue(id) < getTimeMemoized() + 16 * hours &&
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
      else if (isBad(id) && timeSinceTermWasSeen(id) > 20 * minutes) {
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
    overdue_bad: shuffleLocally(
      sortBySortKey(overdue_bad.concat(not_overdue_very_bad))
    ),
    overdue_good: shuffleLocally(sortBySortKey(overdue_good)),
    not_overdue,
  };
};
