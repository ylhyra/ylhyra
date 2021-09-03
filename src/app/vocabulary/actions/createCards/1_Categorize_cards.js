import { hours } from "app/app/functions/time";
import { BAD } from "app/vocabulary/actions/card";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { getUserData } from "app/vocabulary/actions/sync";
import { deck } from "app/vocabulary/actions/deck";
import { CARDS_TO_CREATE } from "app/vocabulary/actions/createCards/index";
import {
  SortIdsByWhetherTermWasRecentlySeen,
  SortBySortKey,
  shuffle_each,
} from "app/vocabulary/actions/createCards/functions";

export default ({ forbidden_ids, allowed_card_ids }) => {
  const now = new Date().getTime();

  /* Previously seen cards */
  let overdue_good_ids = [];
  let overdue_bad_ids = [];
  let not_overdue_bad_cards_ids = [];
  let not_overdue_semi_bad_cards_ids = [];
  let not_overdue = [];
  Object.keys(deck.schedule)
    .filter((id) => !forbidden_ids.includes(id))
    .filter((id) => !allowed_card_ids || allowed_card_ids.includes(id))
    .filter((id) => id in deck.cards)
    .map((id) => ({ id, ...deck.schedule[id] }))
    .sort((a, b) => a.due - b.due)
    .forEach((i) => {
      // console.log(printWord(i.id));
      if (i.due < now + 16 * hours) {
        if (i.score && i.score <= BAD + INCR * 2) {
          overdue_bad_ids.push(i.id);
        } else {
          overdue_good_ids.push(i.id);
        }
      } else if (i.score && i.score === BAD) {
        not_overdue_bad_cards_ids.push(i.id);
      } else if (i.score && i.score <= BAD + INCR) {
        not_overdue_semi_bad_cards_ids.push(i.id);
      } else {
        not_overdue.push(i.id);
      }
    });

  /* New cards */
  let new_card_ids = [];
  for (let i = 0; i < deck.cards_sorted.length; i++) {
    const { id } = deck.cards_sorted[i];
    if (forbidden_ids.includes(id)) continue;
    if (allowed_card_ids && !allowed_card_ids.includes(id)) continue;
    if (new_card_ids.length < CARDS_TO_CREATE || deck.isEasinessLevelOn()) {
      if (!(id in deck.schedule)) {
        new_card_ids.push(id);
      }
    } else {
      break;
    }
  }
  if (allowed_card_ids) {
    new_card_ids.sort(
      (a, b) => allowed_card_ids.indexOf(a) - allowed_card_ids.indexOf(b)
    );
  } else if (deck.isEasinessLevelOn()) {
    new_card_ids = new_card_ids
      .map((id) => {
        const { sortKey } = deck.cards[id];
        return {
          key:
            sortKey > getUserData("easinessLevel") ? sortKey : 100000 - sortKey,
          id,
        };
      })
      .sort((a, b) => a.key - b.key)
      .map((v) => v.id);
    // console.log(_.uniq(new_card_ids.slice(0, 15).map(printWord)).join(" - "));
  } else {
    new_card_ids = SortBySortKey(new_card_ids);
  }

  overdue_good_ids = SortBySortKey(overdue_good_ids);
  overdue_bad_ids = SortBySortKey(overdue_bad_ids);

  not_overdue_bad_cards_ids = shuffle_each(
    SortIdsByWhetherTermWasRecentlySeen(
      SortBySortKey(not_overdue_bad_cards_ids)
    ),
    10
  );
  const very_recently_seen_not_overdue_bad_cards = shuffle_each(
    SortIdsByWhetherTermWasRecentlySeen(
      SortBySortKey(not_overdue_bad_cards_ids),
      true
    ),
    10
  );
  not_overdue_semi_bad_cards_ids = shuffle_each(
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
    new_card_ids,
    very_recently_seen_not_overdue_bad_cards,
    not_overdue,
  };
};
