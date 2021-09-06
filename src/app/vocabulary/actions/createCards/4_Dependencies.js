import { BAD } from "app/vocabulary/actions/card";
import { getUserData } from "app/vocabulary/actions/sync";
import { withDependencies } from "app/vocabulary/actions/functions/withDependencies";
import { deck } from "app/vocabulary/actions/deck";
import { INCR } from "app/vocabulary/actions/createSchedule";

export default ({ chosen_ids, forbidden_ids }) => {
  /* Dependencies */
  let new_word_order = [];
  withDependencies(chosen_ids).forEach((card_id) => {
    if (forbidden_ids.includes(card_id)) return;
    if (
      /* Already chosen */
      chosen_ids.includes(card_id) ||
      /* Ignore cards that are below user's easiness level */
      (deck.cards[card_id].sortKey >=
        ((deck.isEasinessLevelOn() && getUserData("easinessLevel")) || 0) &&
        // /* Dependency that is not known */
        // !(card_id in deck.schedule) ||
        /* Dependency with a bad score */
        deck.schedule[card_id]?.score &&
        deck.schedule[card_id].score <= BAD + INCR)
    ) {
      return new_word_order.push(card_id);
    }
  });
  return new_word_order;
};
