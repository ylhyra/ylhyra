import { getUserLevel } from "app/vocabulary/actions/userLevel/index";
import { CardId } from "app/vocabulary/actions/card/types";
import {
  getCardCEFR,
  getDifficulty,
  getImportance,
} from "app/vocabulary/actions/card/card_data";
import {
  A1,
  B1,
  B2,
  DIFFICULT_FOR_ADVANCED,
  DIFFICULT_FOR_BEGINNERS,
  DIFFICULT_FOR_INTERMEDIATE,
  NORMAL_IMPORTANCE,
  USER_LEVEL_ADVANCED,
  USER_LEVEL_BEGINNER,
  USER_LEVEL_INTERMEDIATE,
  USER_LEVEL_NOVICE,
} from "app/vocabulary/constants";

const userLevelToCEFR = {
  [USER_LEVEL_BEGINNER]: A1,
  [USER_LEVEL_NOVICE]: A1,
  [USER_LEVEL_INTERMEDIATE]: B1,
  [USER_LEVEL_ADVANCED]: B2,
};

const whatIsDifficultForUser = {
  [USER_LEVEL_BEGINNER]: DIFFICULT_FOR_BEGINNERS,
  [USER_LEVEL_NOVICE]: DIFFICULT_FOR_BEGINNERS,
  [USER_LEVEL_INTERMEDIATE]: DIFFICULT_FOR_INTERMEDIATE,
  [USER_LEVEL_ADVANCED]: DIFFICULT_FOR_ADVANCED,
};

export const getCardDifficultyRelativeToUsersLevel = (id: CardId): number => {
  const cardCEFR = getCardCEFR(id);
  const userLevel = getUserLevel();
  const cardDifficulty = getDifficulty(id);
  let outputDifficulty = 0;
  if (cardDifficulty) {
    const difficultyDelta = cardDifficulty - whatIsDifficultForUser[userLevel];
    outputDifficulty += (5 + difficultyDelta) * (difficultyDelta >= 0 ? 10 : 1);
  }
  const cefrDelta = cardCEFR - userLevelToCEFR[userLevel];
  outputDifficulty += 0.1 * (5 + cefrDelta) * (cefrDelta >= 0 ? 10 : 1);
  return outputDifficulty;
};

export const getRelativeCardImportance = (id: CardId): number => {
  const cardImportance = getImportance(id);
  const importanceRelativeToNormal = cardImportance - NORMAL_IMPORTANCE;
};

/* If unseen (?) */

// export const getSortingBasedOnUserLevel = (id: CardId): number => {
//   // getUserLevel();
// };
