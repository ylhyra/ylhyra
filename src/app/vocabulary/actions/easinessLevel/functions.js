import { deck } from "app/vocabulary/actions/deck";
import { getUserData, setUserData } from "app/vocabulary/actions/sync";
import { log } from "app/app/functions/log";
import {
  DEFAULT_JUMP_DOWN,
  MAX_JUMP_UP,
  MIN_JUMP_UP,
} from "app/vocabulary/actions/easinessLevel/index";
import { BAD } from "app/vocabulary/actions/cardInSession";
import { sortBySortKey } from "app/vocabulary/actions/createCards/functions";

let last_jump_up;

export const increaseEasinessLevel = (currentCardSortKey) => {
  let change = Math.min(last_jump_up * 2 || MIN_JUMP_UP, MAX_JUMP_UP);
  last_jump_up = change;
  const newBasedOnCurrentCard = currentCardSortKey + change;
  const newBasedOnCurrentEasinessLevel = getEasinessLevel() + change;
  if (newBasedOnCurrentCard < getEasinessLevel()) {
    return;
  }
  const newValue = Math.min(newBasedOnCurrentEasinessLevel, getMaxSortKey());
  const change2 = newValue - getEasinessLevel();
  if (change2 > MIN_JUMP_UP) {
    setEasinessLevel(newValue);
    recreateSessionCardsAfterChangingEasinessLevel(change2);
  }
};

export const easinessLevelShouldBeLowerThan = (currentCardSortKey) => {
  let min = Math.max(0, currentCardSortKey - DEFAULT_JUMP_DOWN);
  const change = min - getEasinessLevel();
  if (change < -10) {
    setEasinessLevel(min);
    if (Math.abs(change) > DEFAULT_JUMP_DOWN) {
      recreateSessionCardsAfterChangingEasinessLevel(change);
    }
  }
};

export const getLowestBadCardSortKey = () => {
  return Math.min(
    /* Lowest bad in session */
    ...deck.session.cards
      .filter((card) => card.history.includes(BAD))
      .map((card) => card.sortKey),
    /* Lowest bad in schedule */
    deck.cards_sorted.find((card) => card.isBelowGood())?.sortKey || Infinity
  );
};

export const getMaxSortKey = () => {
  /* Can not go higher than the lowest bad cardInSession */
  const lowestBadCard = getLowestBadCardSortKey();

  /* Can not go higher than level B1 */
  const highestCardInLevelB1 =
    deck.cards_sorted
      .slice()
      /* Goes backwards to find the last cardInSession that is on a B1 level */
      .reverse()
      .find((card) => card.level === 3)?.sortKey || Infinity;

  return Math.min(
    Math.min(lowestBadCard, highestCardInLevelB1),
    deck.cards_sorted.length - MAX_JUMP_UP
  );
};

export const recreateSessionCardsAfterChangingEasinessLevel = (change) => {
  /* Clear unseen cards */
  /** @type {Array.<CardInSession>} */
  deck.session.cards = deck.session.cards.filter(
    (card) =>
      card.hasBeenSeenInSession() || card.cannotBeShownBefore || card.done
  );

  /* Find cards that are now too easy and postpone them */
  deck.session.cards.forEach((card) => {
    if (card.done) return;
    if (card.sortKey < getEasinessLevel()) {
      card.showIn({ minInterval: 5000 + getEasinessLevel() - card.sortKey });
    }
  });

  // /* Easiness level has been lowered */
  // if (change < 0) {
  //   /* Find cards that are exactly in the newly lowered range */
  //   const cardsInLoweredRange =
  //     deck.session.cards.filter(
  //       (card) =>
  //         !card.done &&
  //         getEasinessLevel() <= card.sortKey &&
  //         card.sortKey <= getEasinessLevel() - change
  //       // card.showIn({ minInterval: 1000 + getEasinessLevel() + card.sortKey });
  //     ) |> sortBySortKey;
  //   if (cardsInLoweredRange.length > 0) {
  //   }
  // }

  deck.session.createCards({ insertImmediately: true });
};

export const setEasinessLevel = (val) => {
  setUserData("easinessLevel", val);
  log(`Easiness level set to ${val}`);
};

export const getEasinessLevel = () => {
  const val = getUserData("easinessLevel");
  if (!val) return 0;
  return parseInt(val);
};

export function isEasinessLevelOn() {
  return Boolean(!deck.session.allowed_ids && getEasinessLevel());
}
