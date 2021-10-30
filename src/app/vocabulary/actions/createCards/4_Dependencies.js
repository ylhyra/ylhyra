import { withDependencies } from "app/vocabulary/actions/functions/dependencies";
import { getLowestBadCardSortKey } from "app/vocabulary/actions/easinessLevel/functions";

export const DEPENDENCIES_CAN_BE_X_LOWER_THAN_EASINESS_LEVEL = 200;

export default (chosen_cards) => {
  return chosen_cards;
  // const lowestBadCardSortKey = getLowestBadCardSortKey();
  // const lowestSortKeyOfChosenCards = Math.min(
  //   ...chosen_cards.map((c) => c.sortKey)
  // );
  // return withDependencies(chosen_cards /*{ onlyDirect: true }*/).filter(
  //   (card) =>
  //     !card.isInSession() &&
  //     /* Keep in those already chosen */
  //     (card.isIn(chosen_cards) ||
  //       (!card.wasTermVeryRecentlySeen() &&
  //         /* Include bad dependencies */
  //         (card.isBad()
  //
  //          //  ||
  //          //  /* And dependencies that are unseen and close
  //          // to the difficulty level of the chosen cards */
  //           //  Slökkvi á þessu þar sem þetta er bara pirrandi fyrir nemandann
  //          //  (card.isUnseenTerm() &&
  //          //    (card.sortKey >= lowestBadCardSortKey ||
  //          //      card.sortKey >=
  //          //        lowestSortKeyOfChosenCards -
  //          //          DEPENDENCIES_CAN_BE_X_LOWER_THAN_EASINESS_LEVEL))
  //         )))
  // );
};
