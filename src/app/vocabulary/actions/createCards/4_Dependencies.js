import { BAD } from "app/vocabulary/actions/cardInSession";
import { withDependencies } from "app/vocabulary/actions/functions/withDependencies";
import { deck } from "app/vocabulary/actions/deck";
import { INCR } from "app/vocabulary/actions/createSchedule";
import {
  getEasinessLevel,
  isEasinessLevelOn,
} from "app/vocabulary/actions/easinessLevel/functions";

export default ({ chosen_cards, forbidden_ids }) => {
  /* Dependencies */
  let out = [];
  withDependencies(chosen_cards).forEach((card) => {
    if (
      !card.isAllowed({ forbidden_ids }) ||
      /* Already chosen */
      chosen_cards.some((i) => i.getId() === card.getId()) ||
      /* Ignore cards that are below user's easiness level */
      card.isBelowEasinessLevel() ||
      /* Ignore dependencies with a good score */
      card.getLowestAvailableTermScore() > BAD + INCR
    ) {
      return;
    }
    out.push(card);
  });
  return out;
};
