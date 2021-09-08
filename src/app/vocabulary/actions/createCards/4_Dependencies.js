import { BAD } from "app/vocabulary/actions/cardInSession";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { withDependencies } from "app/vocabulary/actions/card/dependencies";

export default ({ chosen_cards, forbidden_ids }) => {
  return withDependencies(chosen_cards);
  //   .filter(
  //   (card) =>
  //     card.isAllowed({ forbidden_ids }) &&
  //     /* Already chosen */
  //     chosen_cards.some((i) => i.getId() === card.getId()) &&
  //     /* Ignore cards that are below user's easiness level */
  //     !card.isBelowEasinessLevel() &&
  //     /* Ignore dependencies with a good score */
  //     !(card.getLowestAvailableTermScore() > BAD + INCR)
  // );
};
