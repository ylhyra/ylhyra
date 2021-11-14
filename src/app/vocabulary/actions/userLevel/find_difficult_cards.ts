import { getUserLevel } from "app/vocabulary/actions/userLevel/index";
import { CardId } from "app/vocabulary/actions/card/types";
import {
  getCardLevel,
  getDifficulty,
  getImportance,
  getLevel,
} from "app/vocabulary/actions/card/card_data";
import {
  userLevel_BEGINNER,
  userLevel_NOVICE,
  userLevel_INTERMEDIATE,
  userLevel_ADVANCED,
  B1,
  A1,
  B2,
  A2,
  DIFFICULT_FOR_BEGINNERS,
  DIFFICULT_FOR_INTERMEDIATE,
  DIFFICULT_FOR_ADVANCED,
} from "app/vocabulary/constants";

const difficultyLevelToCEFR = {
  [userLevel_BEGINNER]: A1,
  [userLevel_NOVICE]: A1,
  [userLevel_INTERMEDIATE]: B1,
  [userLevel_ADVANCED]: B2,
};

const cardDifficultyToUserLevel = [
  { userLevel: userLevel_BEGINNER, difficulty: DIFFICULT_FOR_BEGINNERS },
  { userLevel: userLevel_NOVICE, difficulty: DIFFICULT_FOR_BEGINNERS },
  {
    userLevel: userLevel_INTERMEDIATE,
    difficulty: DIFFICULT_FOR_INTERMEDIATE,
  },
  { userLevel: userLevel_ADVANCED, difficulty: DIFFICULT_FOR_ADVANCED },
];

export const howDifficultIsCard = (id: CardId): number => {
  /* If unseen (?) */
  const cardLevel = getCardLevel(id);
  const userLevel = getUserLevel();

  const cardDifficulty = getDifficulty(id);
  const cardImportance = getImportance(id);

  let outputDifficulty = 0;

  if (cardDifficulty) {
    const indexOfCardDifficulty = cardDifficultyToUserLevel.findIndex(
      (j) => j.difficulty === cardDifficulty
    );
    const indexOfUserLevel = cardDifficultyToUserLevel.findIndex(
      (j) => j.userLevel === userLevel
    );
  }

  // switch (userLevel) {
  //   case userLevel_BEGINNER:
  //   case userLevel_NOVICE:
  //   case userLevel_INTERMEDIATE:
  //   case userLevel_ADVANCED:
  // }
};

export const getSortingBasedOnUserLevel = (id: CardId): number => {
  // getUserLevel();
};
