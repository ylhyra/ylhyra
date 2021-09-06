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
    getMaxSortKey()
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

export const getMaxSortKey = () => {
  /* Can not go higher than the lowest bad card */
  const lowestBadCard =
    deck.cards_sorted.find(
      (card) => deck.schedule[card.id] && deck.schedule[card.id].score < GOOD
    )?.sortKey || Infinity;

  /* Can not go higher than level B1 */
  const highestCardInLevelB1 =
    deck.cards_sorted
      .slice()
      /* Goes backwards to find the last card that is on a B1 level */
      .reverse()
      .find((card) => card.level === 3)?.sortKey || Infinity;

  return Math.min(
    Math.min(lowestBadCard, highestCardInLevelB1),
    deck.cards_sorted.length - MAX_JUMP_UP
  );
};

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

export const setEasinessLevel = (val) => {
  setUserData("easinessLevel", val);
  log(`Easiness level set to ${val}`);
};

export const getEasinessLevel = () => {
  return getUserData("easinessLevel");
};
export function isEasinessLevelOn() {
  return Boolean(!this.session.allowed_card_ids && getEasinessLevel());
}
