import { getTime, hours, minutes } from "app/app/functions/time";
import { sortBySortKey } from "app/vocabulary/actions/createCards/functions";
import { shuffleLocally } from "app/app/functions/shuffleLocally";
import { getCardsInSchedule } from "app/vocabulary/actions/card/functions";
import { log } from "app/app/functions/log";

/* Previously seen cards */
export default () => {
  /** @type {Array.<Card>} */
  let overdue_good = [];
  /** @type {Array.<Card>} */
  let overdue_bad = [];
  /** @type {Array.<Card>} */
  let not_overdue_very_bad = [];
  /** @type {Array.<Card>} */
  let not_overdue = [];

  getCardsInSchedule()
    .filter((card) => card.isAllowed())
    .forEach((card) => {
      /* Overdue */
      if (
        card.getDue() < getTime() + 16 * hours &&
        !card.isTooEasy() &&
        !card.wasTermVeryRecentlySeen()
      ) {
        if (card.isBelowGood() || card.isUnseenSiblingOfANonGoodCard()) {
          overdue_bad.push(card);
        } else {
          overdue_good.push(card);
        }
      }
      // Very bad cards seen more than 20 minutes ago are also added to the overdue pile
      else if (card.isBad() && card.timeSinceTermWasSeen() > 20 * minutes) {
        not_overdue_very_bad.push(card);
      } else {
        not_overdue.push(card);
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
