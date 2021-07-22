import { average, clamp } from "app/App/functions/math";
import { hour, day } from "app/App/functions/time";
import _ from "underscore";
import { BAD, GOOD, EASY } from "./card";
import { printWord, getCardsWithSameTerm } from "./functions";
import { PercentageKnown } from "app/Vocabulary/actions/functions/percentageKnown";
import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";

const CARDS_TO_CREATE = 30;

/**
 * @memberof Session
 */
export default function createCards(options) {
  const session = this;
  const deck = this.deck;
  const now = new Date().getTime();
  // let forbidden_ids = (options && options.forbidden_ids) || [];
  let forbidden_ids = session.cards.map((i) => i.id);
  let allowed_card_ids = session.allowed_card_ids || null;
  // console.log({
  //   forbidden_ids,
  //   allowed_card_ids,
  //   k: allowed_card_ids.filter((i) => !forbidden_ids.includes(i)),
  // });
  if (
    allowed_card_ids &&
    allowed_card_ids.filter((i) => !forbidden_ids.includes(i)).length === 0
  ) {
    allowed_card_ids = null;
  }
  // console.log({ allowed_card_ids });
  const reset = (options && options.reset) || null;

  /* Previously seen cards */
  let overdue_good_ids = [];
  let overdue_bad_ids = [];
  let unadjusted_overdue_good_ids = [];
  let unadjusted_overdue_bad_ids = [];
  let not_overdue_bad_cards_ids = [];
  let not_overdue_semi_bad_cards_ids = [];
  let not_overdue = [];
  // let allScores = [];
  let scheduled = Object.keys(deck.schedule)
    .filter((id) => !forbidden_ids.includes(id))
    .filter((id) => !allowed_card_ids || allowed_card_ids.includes(id))
    .filter((id) => id in deck.cards)
    .map((id) => ({ id, ...deck.schedule[id] }))
    .sort((a, b) => a.due - b.due)
    .forEach((i) => {
      // console.log(printWord(i.id));
      if (i.due < now + 0.7 * day) {
        if (i.score && i.score <= 1.75) {
          overdue_bad_ids.push(i.id);
        } else {
          overdue_good_ids.push(i.id);
        }
      } else if (i.score && i.score < 1.45) {
        not_overdue_bad_cards_ids.push(i.id);
      } else if (i.score && i.score < 1.9) {
        not_overdue_semi_bad_cards_ids.push(i.id);
      }
    });

  /* New cards */
  let new_card_ids = [];
  for (let i = 0; i < deck.cards_sorted.length; i++) {
    const id = deck.cards_sorted[i].id;
    if (forbidden_ids.includes(id)) continue;
    if (allowed_card_ids && !allowed_card_ids.includes(id)) continue;
    if (new_card_ids.length < CARDS_TO_CREATE) {
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
  }

  overdue_good_ids = SortBySortKey2(overdue_good_ids, deck);
  overdue_bad_ids = SortBySortKey2(overdue_bad_ids, deck);

  not_overdue_bad_cards_ids = SortIdsByWhetherTermWasRecentlySeen(
    SortBySortKey2(not_overdue_bad_cards_ids, deck),
    deck
  );
  const very_recently_seen_not_overdue_bad_cards =
    SortIdsByWhetherTermWasRecentlySeen(
      SortBySortKey2(not_overdue_bad_cards_ids, deck),
      deck,
      true
    );
  not_overdue_semi_bad_cards_ids = SortIdsByWhetherTermWasRecentlySeen(
    SortBySortKey2(not_overdue_semi_bad_cards_ids, deck),
    deck
  );

  let total_options =
    overdue_bad_ids.length +
    overdue_good_ids.length +
    not_overdue_bad_cards_ids.length +
    not_overdue_semi_bad_cards_ids.length +
    new_card_ids.length;
  let chosen_ids = [];
  const total_overdue = overdue_bad_ids.length + overdue_good_ids.length;
  const badratio = PercentageKnown(overdue_bad_ids.concat(overdue_good_ids));
  let newCardEvery = 5;
  let bad_count = overdue_bad_ids.length + not_overdue_bad_cards_ids.length;
  if (bad_count > 15) {
    newCardEvery = 10;
  }
  if (bad_count > 40) {
    newCardEvery = 35;
  }
  process.env.NODE_ENV === "development" &&
    console.log({
      overdue_bad_ids_length: overdue_bad_ids.length,
      overdue_good_ids_length: overdue_good_ids.length,
      new_card_ids_length: new_card_ids.length,
      not_overdue_bad_cards_ids: not_overdue_bad_cards_ids.length,
      not_overdue_semi_bad_cards_ids: not_overdue_semi_bad_cards_ids.length,
      // overdue_bad_ids: overdue_bad_ids.map(printWord),
      // overdue_good_ids: overdue_good_ids.map(printWord),
      // new_card_ids: new_card_ids.map(printWord),
      newCardEvery,
    });

  for (
    let i = 0;
    chosen_ids.length < Math.min(CARDS_TO_CREATE, total_options) && i < 1000;
    i++
  ) {
    // const showEvery = () => {
    //
    // }

    if (!empty(overdue_good_ids)) {
      chosen_ids.push(overdue_good_ids.shift());
    }
    if (!empty(overdue_bad_ids)) {
      chosen_ids.push(overdue_bad_ids.shift());
    }
    if (
      i % newCardEvery === Math.floor(newCardEvery / 2) &&
      !empty(new_card_ids)
    ) {
      chosen_ids.push(new_card_ids.shift());
    }

    /* Occasionally show a bad card that the user saw in the last session */
    if (i % 4 === 2) {
      if (!empty(very_recently_seen_not_overdue_bad_cards)) {
        process.env.NODE_ENV === "development" &&
          console.log(
            `Very recently seen word "${printWord(
              very_recently_seen_not_overdue_bad_cards[0]
            )}" added`
          );
        chosen_ids.push(very_recently_seen_not_overdue_bad_cards.shift());
      }
    }

    if ((empty(overdue_good_ids) && empty(overdue_bad_ids)) || i % 2 === 1) {
      if (!empty(not_overdue_bad_cards_ids)) {
        process.env.NODE_ENV === "development" &&
          console.log(
            `Not overdue bad card "${printWord(
              not_overdue_bad_cards_ids[0]
            )}" added`
          );
        chosen_ids.push(not_overdue_bad_cards_ids.shift());
      }
    }
    if (empty(overdue_good_ids) && empty(overdue_bad_ids)) {
      if (i % 4 === 4 - 1 && !empty(not_overdue_semi_bad_cards_ids)) {
        process.env.NODE_ENV === "development" &&
          console.log(
            `Not overdue good card "${printWord(
              not_overdue_semi_bad_cards_ids[0]
            )}" added`
          );
        chosen_ids.push(not_overdue_semi_bad_cards_ids.shift());
      }
    }
    // /* Todo? */
    // if (i % 50 === 50 - 1 && not_overdue_bad_cards_ids.length > 0) {
    //   chosen_ids.push(not_overdue_bad_cards_ids.shift());
    // }
  }

  // chosen_ids = SortIdsByWhetherTermWasRecentlySeen(chosen_ids, deck);
  // chosen_ids = chosen_ids.slice(0, CARDS_TO_CREATE);

  /* Dependencies */
  let tmp = [];
  // console.log(chosen_ids.map(printWord).join(" • "));
  // console.log(withDependencies(chosen_ids).map(printWord).join(" • "));
  // console.log("---");
  withDependencies(chosen_ids).forEach((card_id) => {
    if (forbidden_ids.includes(card_id)) return;
    if (
      /* Already chosen */
      chosen_ids.includes(card_id) ||
      /* Dependency that is not known */
      !(card_id in deck.schedule) ||
      (deck.schedule[card_id].score &&
        deck.schedule[card_id].score < 1.4 &&
        deck.schedule[card_id].last_seen < now - 0.7 * day)
    ) {
      return tmp.push(card_id);
    }
  });
  chosen_ids = tmp;

  chosen_ids = _.uniq(chosen_ids.filter(Boolean));

  deck.session.loadCards(chosen_ids, options);
}

const ScoreByTimeSinceTermWasSeen = (id, deck, now) => {
  let latest = null;
  getCardsWithSameTerm(id).forEach((sibling_card_id) => {
    if (deck.schedule[sibling_card_id]) {
      if (deck.schedule[sibling_card_id].last_seen > latest) {
        latest = deck.schedule[sibling_card_id].last_seen;
      }
    }
  });
  let hoursSinceSeen = (now - latest) / hour;
  if (hoursSinceSeen < 0.3) {
    return 3;
  } else if (hoursSinceSeen < 2) {
    return 2;
  } else if (hoursSinceSeen < 12) {
    return 1;
  } else if (hoursSinceSeen < 30) {
    return 0.5;
  } else {
    return 0;
  }
  // return hoursSinceSeen
};
const SortIdsByWhetherTermWasRecentlySeen = (input, deck, reverse) => {
  const now = new Date().getTime();
  let j = input
    .map((id) => ({
      id,
      hours_since_seen_score: ScoreByTimeSinceTermWasSeen(id, deck, now),
    }))
    .sort((a, b) => a.hours_since_seen_score - b.hours_since_seen_score);
  if (reverse) {
    j = j.reverse();
  }
  return j.map((i) => i.id);
};
const SortBySortKey2 = (array, deck) => {
  const x = array.sort(
    (a, b) => deck.cards[a].sortKey2 - deck.cards[b].sortKey2
  );
  let out = [];
  const shuffle_each = 20;
  for (let i = 0; i < x.length; i += shuffle_each) {
    out = out.concat(_.shuffle(x.slice(i, i + shuffle_each)));
  }
  return out;
};
const empty = (array) => array.length === 0;
