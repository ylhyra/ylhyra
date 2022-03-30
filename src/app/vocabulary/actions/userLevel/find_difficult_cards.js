"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelativeCardImportance = exports.getCardDifficultyRelativeToUsersLevel = void 0;
const card_data_1 = require("app/vocabulary/actions/card/card_data");
const index_1 = require("app/vocabulary/actions/userLevel/index");
const constants_1 = require("app/vocabulary/constants");
const userLevelToCEFR = {
    [constants_1.USER_LEVEL_BEGINNER]: constants_1.A1,
    [constants_1.USER_LEVEL_NOVICE]: constants_1.A1,
    [constants_1.USER_LEVEL_INTERMEDIATE]: constants_1.B1,
    [constants_1.USER_LEVEL_ADVANCED]: constants_1.B2,
};
const whatIsDifficultForUser = {
    [constants_1.USER_LEVEL_BEGINNER]: constants_1.DIFFICULT_FOR_BEGINNERS,
    [constants_1.USER_LEVEL_NOVICE]: constants_1.DIFFICULT_FOR_BEGINNERS,
    [constants_1.USER_LEVEL_INTERMEDIATE]: constants_1.DIFFICULT_FOR_INTERMEDIATE,
    [constants_1.USER_LEVEL_ADVANCED]: constants_1.DIFFICULT_FOR_ADVANCED,
};
const getCardDifficultyRelativeToUsersLevel = (id) => {
    const cardCEFR = (0, card_data_1.getCardCEFR)(id);
    const userLevel = (0, index_1.getUserLevel)();
    const cardDifficulty = (0, card_data_1.getDifficulty)(id);
    let outputDifficulty = 0;
    if (cardDifficulty) {
        const difficultyDelta = cardDifficulty - whatIsDifficultForUser[userLevel];
        outputDifficulty += (5 + difficultyDelta) * (difficultyDelta >= 0 ? 10 : 1);
    }
    const cefrDelta = cardCEFR - userLevelToCEFR[userLevel];
    outputDifficulty += 0.1 * (5 + cefrDelta) * (cefrDelta >= 0 ? 10 : 1);
    return outputDifficulty;
};
exports.getCardDifficultyRelativeToUsersLevel = getCardDifficultyRelativeToUsersLevel;
const getRelativeCardImportance = (id) => {
    const cardImportance = (0, card_data_1.getImportance)(id);
    const importanceRelativeToNormal = cardImportance - constants_1.NORMAL_IMPORTANCE;
};
exports.getRelativeCardImportance = getRelativeCardImportance;
/* If unseen (?) */
// export const getSortingBasedOnUserLevel = (id: CardId): number => {
//   // getUserLevel();
// };
