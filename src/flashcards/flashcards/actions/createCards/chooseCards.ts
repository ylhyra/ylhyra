import { Card } from "flashcards/flashcards/actions/card/card";
import {
  CARDS_TO_CREATE,
  CreateCardsOptions,
} from "flashcards/flashcards/actions/createCards";
import {
  sortCardsByScore,
  veryRecentlySeenSortedLast,
} from "flashcards/flashcards/actions/createCards/functions";
import { getNewCards } from "flashcards/flashcards/actions/createCards/newCards";
import { oldCards } from "flashcards/flashcards/actions/createCards/oldCards";
import { isEmpty } from "modules/isEmpty";
import { log } from "modules/log";

export const chooseCards = (options?: CreateCardsOptions): Card[] => {
  /**
   * chosenCards starts out as an array of nulls;
   * the slots will later be filled.
   */
  let chosenCards: (Card | null | undefined)[] =
    Array(CARDS_TO_CREATE).fill(null);

  /**
   * Helper function to add to chosenCards.
   * Manipulates chosenCards directly.
   */
  const addToChosenCards = (
    cards: Card[],
    /** Only used for logging */
    description: string,
    pos?: number
  ) => {
    if (!isEmpty(cards)) {
      if (pos === undefined) {
        pos = chosenCards.findIndex((j) => j === null);
        if (pos < 0) {
          pos = chosenCards.length;
        }
      }
      log(
        `${description} card "${cards[0].printWord()}" added at position ${
          pos + 1
        }`
      );
      chosenCards[pos] = cards.shift();
    }
  };

  const { overdueBad, overdueGood, notOverdue } = oldCards();

  const newCards = getNewCards(options);

  let totalOptions = overdueBad.length + overdueGood.length;
  let badCount = overdueBad.length;

  // isDev &&
  //   logDev({
  //     overdueGood: { ...overdueGood },
  //     overdueBad: { ...overdueBad },
  //     newCards: { ...newCards },
  //     notOverdue: { ...notOverdue },
  //   });

  let newCardEvery = 2;
  if (badCount > 100) {
    newCardEvery = 7;
  } else if (badCount > 40) {
    newCardEvery = 5;
  } else if (badCount > 15) {
    newCardEvery = 4;
  }

  /**
   * Start by spreading new cards into chosen_cards with a given interval.
   * Unfilled slots are left as null.
   */
  for (
    let pos = newCardEvery;
    pos < CARDS_TO_CREATE && !isEmpty(newCards);
    pos += newCardEvery
  ) {
    addToChosenCards(newCards, "New", pos);
  }

  /**
   * Now scheduled cards are placed into the slots left over
   */
  for (
    let i = 0;
    chosenCards.filter(Boolean).length <
      Math.min(CARDS_TO_CREATE, totalOptions) && i < 1000;
    i++
  ) {
    addToChosenCards(overdueGood, "Overdue good");
    addToChosenCards(overdueBad, "Overdue bad");
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

  return chosenCards as Card[];
};
