import { isDev } from "modules/isDev";
import { log, logDev } from "modules/log";
import { CardIds } from "ylhyra/app/vocabulary/actions/card/types";
import OldCards from "ylhyra/app/vocabulary/actions/createCards/1_Old_cards";
import NewCards from "ylhyra/app/vocabulary/actions/createCards/2_New_cards";
import {
  sortCardsByScore,
  veryRecentlySeenSortedLast,
} from "ylhyra/app/vocabulary/actions/createCards/functions";
import { CARDS_TO_CREATE } from "ylhyra/app/vocabulary/actions/createCards/index";
import { printWord } from "ylhyra/app/vocabulary/actions/functions";

export default (options): CardIds => {
  /**
   * Chosen_cards starts out as an array of nulls;
   * the slots will later be filled.
   */
  let chosenCards = new Array(CARDS_TO_CREATE).fill(null);

  /* Helper function to add to chosen_cards */
  const add = (arr: CardIds, desc: string, pos?) => {
    if (!isEmpty(arr)) {
      if (pos === undefined) {
        pos = chosenCards.findIndex((j) => j === null);
        if (pos < 0) {
          pos = chosenCards.length;
        }
      }
      log(`${desc} card "${printWord(arr[0])}" added at position ${pos + 1}`);
      chosenCards[pos] = arr.shift();
    }
  };

  const { overdueBad, overdueGood, notOverdue } = OldCards();

  const newCards = NewCards(options);

  let totalOptions = sumOfArrayLengths(overdueBad, overdueGood);
  let badCount = sumOfArrayLengths(overdueBad);

  isDev &&
    logDev({
      overdueGood: { ...overdueGood },
      overdueBad: { ...overdueBad },
      new_cards: { ...newCards },
      notOverdue: { ...notOverdue },
    });

  let newCardEvery = 2;
  if (badCount > 100) {
    newCardEvery = 7;
  } else if (badCount > 40) {
    newCardEvery = 5;
  } else if (badCount > 15) {
    newCardEvery = 4;
  }

  /*
    Start by spreading new cards into chosen_cards with a given interval.
    Unfilled slots are left as null.
  */
  for (
    let pos = newCardEvery;
    pos < CARDS_TO_CREATE && !isEmpty(newCards);
    pos += newCardEvery
  ) {
    add(newCards, "New", pos);
  }

  /*
    Now scheduled cards are placed into the slots left over
  */
  for (
    let i = 0;
    chosenCards.filter(Boolean).length <
      Math.min(CARDS_TO_CREATE, totalOptions) && i < 1000;
    i++
  ) {
    add(overdueGood, "Overdue good");
    add(overdueBad, "Overdue bad");
  }

  chosenCards = chosenCards.filter(Boolean);
  if (chosenCards.length < CARDS_TO_CREATE) {
    chosenCards = chosenCards.concat(newCards).slice(0, CARDS_TO_CREATE);
  }

  /**
   * If no cards generated by the above,
   * we simply return cards that are not overdue.
   */
  if (chosenCards.length === 0) {
    chosenCards = veryRecentlySeenSortedLast(sortCardsByScore(notOverdue));
    console.error("No cards generated. Falling back to all cards.");
  }

  return chosenCards;
};

export const isEmpty = (array) => array.length === 0;
export const sumOfArrayLengths = (...arrays) => {
  let length = 0;
  arrays.forEach((a) => (length += a.length));
  return length;
};