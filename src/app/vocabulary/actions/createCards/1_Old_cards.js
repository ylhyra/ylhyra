import { BAD } from "app/vocabulary/actions/cardInSession";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { deck } from "app/vocabulary/actions/deck";
import { hours } from "app/app/functions/time";
import {
  SortBySortKey,
  SortIdsByWhetherTermWasRecentlySeen,
} from "app/vocabulary/actions/createCards/functions";
import { shuffleEach } from "app/app/functions/shuffleEach";

export default ({ forbidden_ids, allowed_card_ids }) => {
  const now = new Date().getTime();

  /* Previously seen cards */
  let overdue_good_ids = [];
  let overdue_bad_ids = [];
  let not_overdue_bad_cards_ids = [];
  let not_overdue_semi_bad_cards_ids = [];
  let not_overdue_ids = [];
  Object.keys(deck.schedule)
    .filter((id) => !forbidden_ids.includes(id))
    .filter((id) => !allowed_card_ids || allowed_card_ids.includes(id))
    .filter((id) => id in deck.cards)
    .map((id) => ({ id, ...deck.schedule[id] }))
    .sort((a, b) => a.due - b.due)
    .forEach((schedule_item) => {
      // log(printWord(i.id));
      if (schedule_item.due < now + 16 * hours) {
        if (schedule_item.score && schedule_item.score <= BAD + INCR * 2) {
          overdue_bad_ids.push(schedule_item.id);
        } else {
          overdue_good_ids.push(schedule_item.id);
        }
      } else if (schedule_item.score && schedule_item.score === BAD) {
        not_overdue_bad_cards_ids.push(schedule_item.id);
      } else if (schedule_item.score && schedule_item.score <= BAD + INCR) {
        not_overdue_semi_bad_cards_ids.push(schedule_item.id);
      } else {
        not_overdue_ids.push(schedule_item.id);
      }
    });


  overdue_good_ids = SortBySortKey(overdue_good_ids);
  overdue_bad_ids = SortBySortKey(overdue_bad_ids);

  not_overdue_bad_cards_ids = shuffleEach(
    SortIdsByWhetherTermWasRecentlySeen(
      SortBySortKey(not_overdue_bad_cards_ids)
    ),
    10
  );
  const very_recently_seen_not_overdue_bad_cards = shuffleEach(
    SortIdsByWhetherTermWasRecentlySeen(
      SortBySortKey(not_overdue_bad_cards_ids),
      true
    ),
    10
  );
  not_overdue_semi_bad_cards_ids = shuffleEach(
    SortIdsByWhetherTermWasRecentlySeen(
      SortBySortKey(not_overdue_semi_bad_cards_ids)
    ),
    10
  );

  return {
    overdue_bad_ids,
    overdue_good_ids,
    not_overdue_bad_cards_ids,
    not_overdue_semi_bad_cards_ids,
    very_recently_seen_not_overdue_bad_cards,
    not_overdue_ids,
  };
};
