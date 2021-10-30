import { CARDS_TO_CREATE } from "app/vocabulary/actions/createCards/index";
import {
  sortCardsByScore,
  veryRecentlySeenSortedLast,
} from "app/vocabulary/actions/createCards/functions";
import { log, logDev } from "app/app/functions/log";
import OldCards from "app/vocabulary/actions/createCards/1_Old_cards";
import NewCards from "app/vocabulary/actions/createCards/2_New_cards";
import { isDev } from "app/app/functions/isDev";

export default (options) => {
  /**
   * Chosen_cards starts out as an array of nulls;
   * the slots will later be filled.
   * @type {Array.<Card|null>}
   */
  let chosen_cards = new Array(CARDS_TO_CREATE).fill(null);

  /* Helper function to add to chosen_cards */
  const add = (arr, desc, pos) => {
    if (!isEmpty(arr)) {
      if (pos === undefined) {
        pos = chosen_cards.findIndex((j) => j === null);
        if (pos < 0) {
          pos = chosen_cards.length;
        }
      }
      log(`${desc} card "${arr[0].printWord()}" added at position ${pos + 1}`);
      chosen_cards[pos] = arr.shift();
    }
  };

  const {
    /** @type {Array.<Card>} */
    overdue_bad,
    /** @type {Array.<Card>} */
    overdue_good,
    /** @type {Array.<Card>} */
    not_overdue,
  } = OldCards();

  /** @type {Array.<Card>} */
  const new_cards = NewCards(options);

  let total_options = sumOfArrayLengths(overdue_bad, overdue_good);
  let bad_count = sumOfArrayLengths(overdue_bad);

  isDev &&
    logDev({
      overdue_good: { ...overdue_good },
      overdue_bad: { ...overdue_bad },
      new_cards: { ...new_cards },
      not_overdue: { ...not_overdue },
    });

  let newCardEvery = 2;
  if (bad_count > 100) {
    newCardEvery = 7;
  } else if (bad_count > 40) {
    newCardEvery = 5;
  } else if (bad_count > 15) {
    newCardEvery = 4;
  }

  /*
    Start by spreading new cards into chosen_cards with a given interval.
    Unfilled slots are left as null.
  */
  for (
    let pos = newCardEvery;
    pos < CARDS_TO_CREATE && !isEmpty(new_cards);
    pos += newCardEvery
  ) {
    add(new_cards, "New", pos);
  }

  /*
    Now scheduled cards are placed into the slots left over
  */
  for (
    let i = 0;
    chosen_cards.filter(Boolean).length <
      Math.min(CARDS_TO_CREATE, total_options) && i < 1000;
    i++
  ) {
    add(overdue_good, "Overdue good");
    add(overdue_bad, "Overdue bad");
  }

  chosen_cards = chosen_cards.filter(Boolean);
  if (chosen_cards.length < CARDS_TO_CREATE) {
    chosen_cards = chosen_cards.concat(new_cards).slice(0, CARDS_TO_CREATE);
  }

  /**
   * If no cards generated by the above,
   * we simply return cards that are not overdue.
   */
  if (chosen_cards.length === 0) {
    chosen_cards = veryRecentlySeenSortedLast(sortCardsByScore(not_overdue));
    console.error("No cards generated. Falling back to all cards.");
  }

  return chosen_cards;
};

export const isEmpty = (array) => array.length === 0;
export const sumOfArrayLengths = (...arrays) => {
  let length = 0;
  arrays.forEach((a) => (length += a.length));
  return length;
};
