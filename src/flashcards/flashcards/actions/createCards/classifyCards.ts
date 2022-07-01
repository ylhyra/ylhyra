import { Card } from "flashcards/flashcards/actions/card/card";
import {
  isBad,
  isBelowGood,
} from "flashcards/flashcards/actions/card/cardDifficulty";
import { isAllowed } from "flashcards/flashcards/actions/card/cardIsAllowed";
import {
  isInSchedule,
  isOverdue,
  isUnseenSiblingOfANonGoodCard,
  timeSinceRowWasSeen,
  wasRowVeryRecentlySeen,
} from "flashcards/flashcards/actions/card/cardSchedule";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { isBrowser } from "modules/isBrowser";
import { shuffleLocally } from "modules/shuffleLocally";
import { minutes } from "modules/time";
import { sortBy } from "underscore";
// @ts-ignore
import xorshift from "xorshift";

/**
 * Input is a deck in session.allowedDecks.
 * Called by {@link chooseCards}, which will choose a few cards from these.
 */
export function classifyCards(deck: Deck) {
  let overdueGood: Card[] = [];
  let overdueBad: Card[] = [];
  let notOverdue: Card[] = [];
  let newCards: Card[] = [];

  deck.cards
    .filter((card) => isAllowed(card))
    .forEach((card) => {
      if (!isInSchedule(card)) {
        newCards.push(card);
      }

      // Overdue
      else if (
        isOverdue(card) &&
        // !card.isTooEasy() &&
        !wasRowVeryRecentlySeen(card)
      ) {
        if (isBelowGood(card) || isUnseenSiblingOfANonGoodCard(card)) {
          overdueBad.push(card);
        } else {
          overdueGood.push(card);
        }
      }

      // Very bad cards seen more than 20 minutes ago are also added to the overdue pile
      else if (isBad(card) && (timeSinceRowWasSeen(card) || 0) > 20 * minutes) {
        return overdueBad.push(card);
      } else {
        notOverdue.push(card);
      }
    });

  return {
    overdueBad: sortOverdueCards(overdueBad, deck),
    overdueGood: sortOverdueCards(overdueGood, deck),
    newCards: sortNewCards(newCards, deck),
    notOverdue,
  };
}

export function sortOverdueCards(cards: Card[], deck: Deck): Card[] {
  let output: Card[] = [];

  // for(let i=0; i<10&&i<cards.length; i++) {
  //
  // }
  return shuffleLocally(
    sortBy(cards, (card) => {
      switch (deck.settings.sorting) {
        case "RANDOM":
          /**
           * A "random" number that will be stable as
           * it is generated from the row number
           */
          return xorshift.constructor(card.row.data.rowNumber).random();
        case "OLDEST_SEEN":
          throw new Error("Not implemented");
        case "NEWEST_SEEN":
          throw new Error("Not implemented");
        case "OLDEST":
          // TODO: Record date added?
          return card.row.data.rowNumber;
        case "NEWEST":
          return -card.row.data.rowNumber;
        case "EASIEST":
          throw new Error("Not implemented");
        case "HARDEST":
          throw new Error("Not implemented");
      }
    })
  );
}

export function sortNewCards(newCards: Card[], deck: Deck): Card[] {
  const session = getSession();
  // if (session.allowedCards /*&& !options?.dontSortByAllowedCards*/) {
  //   /* Sort in same order as allowedCards */
  //   newCards = sortBy(newCards, (id) => session.allowedCards!.indexOf(id));
  // } else if (options?.skipOverTheEasiest) {
  //   // /*
  //   //   If we are unable to create cards with a given allowedCards,
  //   //   the user does not want to see "Hæ", so we skip over the beginning.
  //   // */
  //   // const lowest = clamp(getLowestBadCardSortKey() || Infinity, 50, 300);
  //   // new_cards = sortBy(new_cards, (i) => i.getSortKeyAdjusted(lowest));
  // }
  isBrowser && console.warn("Sorting of new cards not implemented");
  // return veryRecentlySeenSortedLast(newCards.slice(0, 200));
  return newCards;
}
