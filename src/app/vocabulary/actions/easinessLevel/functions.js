import { GOOD } from "app/vocabulary/actions/card";
import { deck } from "app/vocabulary/actions/deck";
import { getEasinessLevel, setUserData } from "app/vocabulary/actions/sync";
import { log } from "app/app/functions/log";

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
