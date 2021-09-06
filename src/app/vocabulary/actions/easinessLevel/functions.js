import { GOOD } from "app/vocabulary/actions/card";
import { deck } from "app/vocabulary/actions/deck";
import { getUserData, setUserData } from "app/vocabulary/actions/sync";
import { log } from "app/app/functions/log";
import {
  DEFAULT_JUMP_DOWN,
  MAX_JUMP_UP,
  MIN_JUMP_UP,
} from "app/vocabulary/actions/easinessLevel/index";

let last_jump_up;

export const increaseEasinessLevel = () => {
  let change = Math.min(last_jump_up * 2 || MIN_JUMP_UP, MAX_JUMP_UP);
  last_jump_up = change;
  const newValue = Math.min(
    Math.max(0, (getEasinessLevel() || 0) + change),
    getLowestBadSortKey() || getMaxSortKey() || deck.cards_sorted.length
  );
  if (newValue !== getEasinessLevel()) {
    setEasinessLevel(newValue);
    recreateAfterChangingEasinessLevel();
  }
};

export const decreaseEasinessLevel = () => {
  let min = deck.session.currentCard.sortKey - DEFAULT_JUMP_DOWN;
  if (min < getEasinessLevel()) {
    setEasinessLevel(Math.max(0, min));
  }
};

export const getLowestBadSortKey = () => {
  return (
    deck.cards_sorted.find(
      (card) => deck.schedule[card.id] && deck.schedule[card.id].score < GOOD
    )?.sortKey || null
  );
};

/**
 * Maximum is to jump to the end of the B1 level
 */
export const getMaxSortKey = () => {
  return (
    deck.cards_sorted
      .slice()
      /* Goes backwards to find the last card that is on a B1 level */
      .reverse()
      .find((card) => card.level === 3)?.sortKey || null
  );
};

export const setEasinessLevel = (val) => {
  setUserData("easinessLevel", val);
  log(`Easiness level set to ${val}`);
};

export const getEasinessLevel = () => {
  return getUserData("easinessLevel");
};
/* Create new cards */
export const recreateAfterChangingEasinessLevel = () => {
  deck.session.cards = deck.session.cards.filter(
    (card) => card.history.length > 0 || card.cannotBeShownBefore || card.done
  );
  deck.session.cards.forEach((card) => {
    if (card.sortKey < getEasinessLevel()) {
      card.showIn({ minInterval: 100 });
    }
    // else if (
    //   !card.done &&
    //   change < 0 &&
    //   card.sortKey > getUserData('easinessLevel') &&
    //   card.sortKey <= getUserData('easinessLevel') - change
    // ) {
    //   card.showIn({ minInterval: tmp_index });
    // }
  });
  deck.session.createCards();
};

/**
 */
export function isEasinessLevelOn() {
  return Boolean(!this.session.allowed_card_ids && getEasinessLevel());
}
