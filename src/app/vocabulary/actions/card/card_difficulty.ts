import { INCR } from "app/vocabulary/actions/createSchedule";
import {
  getLowestAvailableTermScore,
  getScore,
  getSessionsSeen,
} from "app/vocabulary/actions/card/card_schedule";
import { CardId } from "app/vocabulary/actions/card/types";

export type rating = number;

export const BAD: rating = 1;
export const GOOD: rating = 2;
export const EASY: rating = 3;

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

export const isTooEasy = (id: CardId) => {
  return getScore(id) >= EASY && getSessionsSeen(id) === 1;
};
export const isBad = (id: CardId) => {
  return getScore(id) === BAD;
};
export const isFairlyBad = (id: CardId) => {
  return getScore(id) && getScore(id) <= BAD + INCR;
};
export const isBelowGood = (id: CardId) => {
  const j = getScore(id) || getLowestAvailableTermScore(id);
  return j && j < GOOD;
};
