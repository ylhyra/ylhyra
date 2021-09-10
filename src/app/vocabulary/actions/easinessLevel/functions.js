import { deck } from "app/vocabulary/actions/deck";
import { getUserData, setUserData } from "app/vocabulary/actions/sync";
import { log } from "app/app/functions/log";
import {
  DEFAULT_JUMP_DOWN,
  MAX_JUMP_UP,
  MIN_JUMP_UP,
} from "app/vocabulary/actions/easinessLevel/index";
import { BAD } from "app/vocabulary/actions/cardInSession";

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
  const change = newValue - getEasinessLevel();
  if (change > MIN_JUMP_UP) {
    setEasinessLevel(newValue);
    recreateSessionCardsAfterChangingEasinessLevel(change);
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
  deck.session.cards = deck.session.cards.filter(
    (card) => card.wasSeenInSession() || card.cannotBeShownBefore || card.done
  );
  deck.session.cards.forEach((card) => {
    /* Card too easy (easiness level has been increased) */
    if (card.sortKey < getEasinessLevel()) {
      card.showIn({ minInterval: 1000 + getEasinessLevel() - card.sortKey });
      return;
    }

    /* Card too difficult (easiness level has been decreased) */
    if (
      !card.done &&
      change < 0 &&
      card.sortKey > getEasinessLevel() &&
      card.sortKey <= getEasinessLevel() - change
    ) {
      card.showIn({ minInterval: 1000 + getEasinessLevel() + card.sortKey });
    }
  });
  deck.session.createCards();
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
