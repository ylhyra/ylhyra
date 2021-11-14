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
  DIFFICULT_FOR_BEGINNERS,
  DIFFICULT_FOR_INTERMEDIATE,
  DIFFICULT_FOR_ADVANCED,
} from "app/vocabulary/constants";

const difficultyLevelToCEFR = {
  [USER_LEVEL_BEGINNER]: A1,
  [USER_LEVEL_NOVICE]: A1,
  [USER_LEVEL_INTERMEDIATE]: B1,
  [USER_LEVEL_ADVANCED]: B2,
};

const difficultToUserLevel = [
  { user_level: USER_LEVEL_BEGINNER, difficulty: DIFFICULT_FOR_BEGINNERS },
  { user_level: USER_LEVEL_NOVICE, difficulty: DIFFICULT_FOR_BEGINNERS },
  {
    user_level: USER_LEVEL_INTERMEDIATE,
    difficulty: DIFFICULT_FOR_INTERMEDIATE,
  },
  { user_level: USER_LEVEL_ADVANCED, difficulty: DIFFICULT_FOR_ADVANCED },
];

export const howDifficultIsCard = (id: CardId): number => {
  /* If unseen (?) */
  const cardLevel = getCardLevel(id);
  const userLevel = getUserLevel();

  const cardDifficulty = getDifficulty(id);
  const cardImportance = getImportance(id);

  let outputDifficulty = 0;

  switch (cardDifficulty) {
    case DIFFICULT_FOR_BEGINNERS:
    case DIFFICULT_FOR_INTERMEDIATE:
    case DIFFICULT_FOR_ADVANCED:
  }
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
