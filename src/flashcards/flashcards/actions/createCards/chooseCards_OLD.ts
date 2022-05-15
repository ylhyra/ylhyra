// @ts-nocheck
import { Card } from "flashcards/flashcards/actions/card/card";
import {
  CARDS_TO_CREATE,
  CreateCardsOptions,
} from "flashcards/flashcards/actions/createCards";
import { classifyCards } from "flashcards/flashcards/actions/createCards/classifyCards";
import { isEmpty } from "modules/isEmpty";
import { log } from "modules/log";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

export const chooseCards = (options?: CreateCardsOptions): Card[] => {
  return warnIfFunctionIsSlow.wrap(() => {
    /**
     * chosenCards starts out as an array of nulls;
     * the slots will later be filled.
     */
    let chosenCards: (Card | null)[] = Array(CARDS_TO_CREATE).fill(null);

    /**
     * Helper function to add to chosenCards.
     * Manipulates chosenCards directly.
     *
     * The input is an array, this function takes the first item from that
     * array and adds it to chosenCards at the first available slot.
     */
    const addToChosenCardsFrom = (
      takeFirstItemFromArray: Card[],
      /** Only used for logging */
      description: string,
      position?: number
    ) => {
      if (!isEmpty(takeFirstItemFromArray)) {
        if (position === undefined) {
          /** Is there any slot left in chosenCards that is still null? */
          position = chosenCards.findIndex((j) => j === null);
          if (position < 0) {
            position = chosenCards.length;
          }
        }
        const card = takeFirstItemFromArray.shift()!;
        log(
          `${description} card "` +
            card.printWord() +
            `" added at position ` +
            (position + 1)
        );
        chosenCards[position] = card;
      }
    };

    const { overdueBad, overdueGood, notOverdue, newCards } = classifyCards();

    let totalOptions = overdueBad.length + overdueGood.length;
    let badCount = overdueBad.length;

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
      addToChosenCardsFrom(newCards, "New", pos);
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
      addToChosenCardsFrom(overdueGood, "Overdue good");
      addToChosenCardsFrom(overdueBad, "Overdue bad");
    }

    chosenCards = chosenCards.filter(Boolean);
    if (chosenCards.length < CARDS_TO_CREATE) {
      chosenCards = chosenCards.concat(newCards).slice(0, CARDS_TO_CREATE);
    }

    return chosenCards as Card[];
  });
};
