// export const isBelowEasinessLevel = (id: CardId) => {
//   return isEasinessLevelOn() && getSortKey(id) < getEasinessLevel();
// };
//
// export const getSortKeyAdjustedForEasinessLevel = (id: CardId) => {
//   return getSortKeyAdjusted(id, getEasinessLevel());
// };
//
// export const getSortKeyAdjusted = (j) => {
//   return getSortKey(id) > j ? getSortKey(id) : 100000 - getSortKey(id);
// };

import { getUserLevel } from "app/vocabulary/actions/userLevel/index";
import { CardId } from "app/vocabulary/actions/card/types";
import { getLevel } from "app/vocabulary/actions/card/card_data";
import {
  USER_LEVEL_ADVANCED,
  USER_LEVEL_BEGINNER,
  USER_LEVEL_INTERMEDIATE,
  USER_LEVEL_NOVICE,
} from "app/vocabulary/constants";

export const howDifficultIsCard = (id: CardId): number => {
  /* If unseen (?) */
  const cardLevel = getLevel(id);
  const userLevel = getUserLevel();
  // switch (userLevel) {
  //   case USER_LEVEL_BEGINNER:
  //   case USER_LEVEL_NOVICE:
  //   case USER_LEVEL_INTERMEDIATE:
  //   case USER_LEVEL_ADVANCED:
  // }
};

export const getSortingBasedOnUserLevel = (id: CardId): number => {
  // getUserLevel();
};
