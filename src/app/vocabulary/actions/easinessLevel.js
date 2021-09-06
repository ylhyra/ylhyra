import { log, logDev } from "app/app/functions/log";
import { BAD, GOOD, EASY } from "app/vocabulary/actions/card";
import { deck } from "app/vocabulary/actions/deck";
import { setUserData, getUserData } from "app/vocabulary/actions/sync";

let easyInARow = 0;
const MIN_JUMP = 50;
const MAX_JUMP = 200;
const DEFAULT_JUMP_DOWN = 100;
let last_jump_up;
// let RatingHistoryForNewCards = [];

/**
 * Ef notandi ýtir þrisvar sinnum á easy þá þarf levelið hans að stökkva fram.
 * @module Deck
 */
export function trackEasiness(rating, isNew) {
  if (this.session.allowed_card_ids) return;
  if (isNew) {
    if (rating === EASY) {
      easyInARow++;
      if (easyInARow >= 2) {
        let change = Math.min(last_jump_up * 2 || MIN_JUMP, MAX_JUMP);
        last_jump_up = change;
        const newValue = Math.min(
          Math.max(0, (getEasinessLevel() || 0) + change),
          getLowestBadSortKey() || getMaxSortKey() || deck.cards_sorted.length
        );
        if (newValue !== getEasinessLevel()) {
          setEasinessLevel(newValue);
          recreateAfterChangingEasinessLevel();
        }
      }
    } else {
      easyInARow = 0;
    }
    if (rating === BAD && getEasinessLevel()) {
      let min = deck.session.currentCard.sortKey - DEFAULT_JUMP_DOWN;
      if (min < getEasinessLevel()) {
        setEasinessLevel(Math.max(0, min));
      }
    }
    // RatingHistoryForNewCards.unshift(rating);
  }
}

const getLowestBadSortKey = () => {
  return (
    deck.cards_sorted.find(
      (card) => deck.schedule[card.id] && deck.schedule[card.id].score < GOOD
    )?.sortKey || null
  );
};

/**
 * Maximum is to jump to the end of the B1 level
 */
const getMaxSortKey = () => {
  return (
    deck.cards_sorted
      .slice()
      /* Goes backwards to find the last card that is on a B1 level */
      .reverse()
      .find((card) => card.level === 3)?.sortKey || null
  );
};

const setEasinessLevel = (val) => {
  setUserData("easinessLevel", val);
  log(`Easiness level set to ${val}`);
};

/* Create new cards */
const recreateAfterChangingEasinessLevel = () => {
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
 * @module Deck
 */
export function isEasinessLevelOn() {
  return Boolean(!this.session.allowed_card_ids && getEasinessLevel());
}
