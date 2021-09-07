import { hours, now } from "app/app/functions/time";
import { BAD } from "app/vocabulary/actions/cardInSession";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { deck } from "app/vocabulary/actions/deck";
import {
  SortBySortKey,
  SortIdsByWhetherTermWasRecentlySeen,
} from "app/vocabulary/actions/createCards/functions";
import { shuffleEach } from "app/app/functions/shuffleEach";
import { getCardsInSchedule } from "app/vocabulary/actions/card/functions";

export default ({ forbidden_ids, allowed_ids }) => {
  /* Previously seen cards */
  let overdue_good = [];
  let overdue_bad = [];
  let not_overdue_bad = [];
  let not_overdue_semi_bad = [];
  let not_overdue_ids = [];

  getCardsInSchedule()
    .filter((card) =>
      card.isAllowed({
        forbidden_ids,
        allowed_ids,
      })
    )
    .sort((a, b) => a.getDue() - b.getDue())
    .forEach((card) => {
      if (card.getDue() < now() + 16 * hours) {
        if (card.isScoreLowerThanOrEqualTo(BAD + INCR * 2)) {
          overdue_bad.push(card.getId());
        } else {
          overdue_good.push(card.getId());
        }
      } else if (card.getScore() === BAD) {
        not_overdue_bad.push(card.getId());
      } else if (card.isScoreLowerThanOrEqualTo(BAD + INCR)) {
        not_overdue_semi_bad.push(card.getId());
      } else {
        not_overdue_ids.push(card.getId());
      }
    });

  overdue_good = SortBySortKey(overdue_good);
  overdue_bad = SortBySortKey(overdue_bad);

  not_overdue_bad = shuffleEach(
    SortIdsByWhetherTermWasRecentlySeen(SortBySortKey(not_overdue_bad)),
    10
  );
  const very_recently_seen_not_overdue_bad = shuffleEach(
    SortIdsByWhetherTermWasRecentlySeen(SortBySortKey(not_overdue_bad), true),
    10
  );
  not_overdue_semi_bad = shuffleEach(
    SortIdsByWhetherTermWasRecentlySeen(SortBySortKey(not_overdue_semi_bad)),
    10
  );

  return {
    overdue_bad,
    overdue_good,
    not_overdue_bad,
    not_overdue_semi_bad,
    very_recently_seen_not_overdue_bad,
    not_overdue_ids,
  };
};
