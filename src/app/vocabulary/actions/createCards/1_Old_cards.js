import { hours, now } from "app/app/functions/time";
import { BAD } from "app/vocabulary/actions/cardInSession";
import {
  newestFirst,
  oldestFirst,
  sortBySortKey,
} from "app/vocabulary/actions/createCards/functions";
import { shuffleLocally } from "app/app/functions/shuffleLocally";
import { getCardsInSchedule } from "app/vocabulary/actions/card/functions";

export default ({ forbidden_ids, allowed_ids }) => {
  /* Previously seen cards */
  let overdue_good = [];
  let overdue_bad = [];
  let not_overdue_bad = [];
  let not_overdue_semi_bad = [];
  let not_overdue = [];

  sortBySortKey(getCardsInSchedule())
    .filter((card) =>
      card.isAllowed({
        forbidden_ids,
        allowed_ids,
      })
    )
    .sort((a, b) => a.getDue() - b.getDue())
    .forEach((card) => {
      if (card.getDue() < now() + 16 * hours) {
        if (card.isNotGood()) {
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

  overdue_bad = shuffleLocally(overdue_bad);
  overdue_good = shuffleLocally(overdue_good);
  not_overdue_bad = shuffleLocally(oldestFirst(not_overdue_bad), 10);
  let very_recently_seen_not_overdue_bad = shuffleLocally(
    newestFirst(not_overdue_bad),
    10
  );
  not_overdue_semi_bad = shuffleLocally(oldestFirst(not_overdue_semi_bad));

  return {
    overdue_bad,
    overdue_good,
    not_overdue_bad,
    not_overdue_semi_bad,
    very_recently_seen_not_overdue_bad,
    not_overdue,
  };
};
