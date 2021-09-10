import { isEasinessLevelOn } from "app/vocabulary/actions/easinessLevel/functions";
import { deck } from "app/vocabulary/actions/deck";

/* New cards */
export default () => {
  let new_cards = deck.cards_sorted.filter(
    (card) => !card.isInSchedule() && card.isAllowed()
  );

  if (deck.session.allowed_ids) {
    /* Sort in same order as allowed_ids */
    new_cards.sort(
      (a, b) =>
        deck.session.allowed_ids.indexOf(a.getId()) -
        deck.session.allowed_ids.indexOf(b.getId())
    );
  } else if (isEasinessLevelOn()) {
    new_cards.sort(
      (a, b) =>
        a.getSortKeyAdjustedForEasinessLevel() -
        b.getSortKeyAdjustedForEasinessLevel()
    );
  }

  return new_cards;
};
