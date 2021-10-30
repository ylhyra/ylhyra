import { getTime, hours, minutes } from "app/app/functions/time";
import { sortBySortKey } from "app/vocabulary/actions/createCards/functions";
import { shuffleLocally } from "app/app/functions/shuffleLocally";
import { getCardsInSchedule } from "app/vocabulary/actions/card/functions";

/* Previously seen cards */
export default () => {
  /** @type {Array.<Card>} */
  let overdue_good = [];
  /** @type {Array.<Card>} */
  let overdue_bad = [];
  /** @type {Array.<Card>} */
  let not_overdue = [];

  sortBySortKey(getCardsInSchedule())
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
        overdue_bad.push(card);
      } else {
        not_overdue.push(card);
      }
    });

  return {
    overdue_bad: shuffleLocally(overdue_bad),
    overdue_good: shuffleLocally(overdue_good),
    not_overdue,
  };
};
