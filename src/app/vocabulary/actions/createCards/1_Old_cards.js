import { getTime, hours } from "app/app/functions/time";
import {
  newestFirst,
  oldestFirst,
  sortBySortKey,
} from "app/vocabulary/actions/createCards/functions";
import { shuffleLocally } from "app/app/functions/shuffleLocally";
import { getCardsInSchedule } from "app/vocabulary/actions/card/functions";

/* Previously seen cards */
export default () => {
  /** @type {Array.<Card>} */
  let overdue_good = [];
  /** @type {Array.<Card>} */
  let overdue_bad = [];
  /** @type {Array.<Card>} */
  let not_overdue_bad = [];
  /** @type {Array.<Card>} */
  let not_overdue_semi_bad = [];
  /** @type {Array.<Card>} */
  let not_overdue = [];

  sortBySortKey(getCardsInSchedule())
    .filter((card) => card.isAllowed())
    .sort((a, b) => a.getDue() - b.getDue())
    .forEach((card) => {
      if (
        card.getDue() < getTime() + 16 * hours &&
        !card.wasTermVeryRecentlySeen()
      ) {
        if (card.isBelowGood()) {
          overdue_bad.push(card);
        } else {
          overdue_good.push(card);
        }
      } else if (card.isBad()) {
        not_overdue_bad.push(card);
      } else if (card.isFairlyBad()) {
        not_overdue_semi_bad.push(card);
      } else {
        not_overdue.push(card);
      }
    });

  return {
    overdue_bad: shuffleLocally(overdue_bad),
    overdue_good: shuffleLocally(overdue_good),
    not_overdue_bad: shuffleLocally(oldestFirst(not_overdue_bad)),
    not_overdue_semi_bad: shuffleLocally(oldestFirst(not_overdue_semi_bad)),
    not_overdue,
  };
};
