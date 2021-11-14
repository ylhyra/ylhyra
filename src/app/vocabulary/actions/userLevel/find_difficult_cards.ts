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
import { getCardLevel, getLevel } from "app/vocabulary/actions/card/card_data";
import {
  USER_LEVEL_BEGINNER,
  USER_LEVEL_NOVICE,
  USER_LEVEL_INTERMEDIATE,
  USER_LEVEL_ADVANCED,
  B1,
  A1,
  B2,
  A2,
} from "app/vocabulary/constants";

const difficultyLevelToCEFR = {
  [USER_LEVEL_BEGINNER]: A1,
  [USER_LEVEL_NOVICE]: A1,
  [USER_LEVEL_INTERMEDIATE]: B1,
  [USER_LEVEL_ADVANCED]: B2,
};

export const howDifficultIsCard = (id: CardId): number => {
  /* If unseen (?) */
  const cardLevel = getCardLevel(id);
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
