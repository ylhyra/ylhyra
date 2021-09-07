import { hours, now } from "app/app/functions/time";
import { BAD } from "app/vocabulary/actions/cardInSession";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { deck } from "app/vocabulary/actions/deck";
import {
  newestFirst,
  oldestFirst,
  sortBySortKey,
  sortCardsByWhetherTermWasRecentlySeen,
} from "app/vocabulary/actions/createCards/functions";
import { shuffleEach } from "app/app/functions/shuffleEach";
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
          overdue_bad.push(card.getId());
        } else {
          overdue_good.push(card.getId());
        }
      } else if (card.getScore() === BAD) {
        not_overdue_bad.push(card.getId());
      } else if (card.isFairlyBad()) {
        not_overdue_semi_bad.push(card.getId());
      } else {
        not_overdue.push(card.getId());
      }
    });

  overdue_bad = shuffleEach(overdue_bad);
  overdue_good = shuffleEach(overdue_good);
  not_overdue_bad = shuffleEach(oldestFirst(not_overdue_bad), 10);
  let very_recently_seen_not_overdue_bad = shuffleEach(
    newestFirst(not_overdue_bad),
    10
  );
  not_overdue_semi_bad = shuffleEach(oldestFirst(not_overdue_semi_bad));

  return {
    overdue_bad,
    overdue_good,
    not_overdue_bad,
    not_overdue_semi_bad,
    very_recently_seen_not_overdue_bad,
    not_overdue,
  };
};
