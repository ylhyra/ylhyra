import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { Card } from "flashcards/flashcards/actions/card/card";
import { isAllowed } from "flashcards/flashcards/actions/card/cardIsAllowed";
import {
  isNewRow,
  isOverdueGood,
  isOverdueBad,
} from "flashcards/flashcards/actions/card/cardSchedule";
import {
  sortCards,
  veryRecentlySeenSortedLast,
  sortCardsByScore,
} from "flashcards/flashcards/actions/createCards/functions";
import { loadCardsIntoSession } from "flashcards/flashcards/actions/session/loadCardsIntoSession";

/**
 * We want several categories of cards to be available to the ranking algorithm,
 * but we have to have sorted each category of cards first.
 *
 * Only the relative order of cards within each category matters to the ranking
 * algorithm.
 *
 * The reason only a subset of cards are loaded is to allow us to use server-
 * side loading later on.
 */
export const categorizeCardsAndLoadIntoSession = (deck: Deck) => {
  let overdueGood: Card[] = [];
  let overdueBad: Card[] = [];
  let notOverdue: Card[] = [];
  let newCards: Card[] = [];

  deck.cards
    .filter((card) => isAllowed(card))
    .forEach((card) => {
      if (!isNewRow(card)) {
        newCards.push(card);
      } else if (isOverdueGood(card)) {
        overdueGood.push(card);
      } else if (isOverdueBad(card)) {
        overdueBad.push(card);
      } else {
        notOverdue.push(card);
      }
    });

  overdueBad = sortCards(overdueBad, deck).slice(0, 50);
  overdueGood = sortCards(overdueGood, deck).slice(0, 50);
  newCards = sortCards(newCards, deck, true).slice(0, 50);
  notOverdue = veryRecentlySeenSortedLast(sortCardsByScore(notOverdue)).slice(
    0,
    50,
  );

  loadCardsIntoSession([
    ...overdueBad,
    ...overdueGood,
    ...newCards,
    ...notOverdue,
  ]);
};
