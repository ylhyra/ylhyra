export type rating = number;

export const BAD: rating = 1;
export const GOOD: rating = 2;
export const EASY: rating = 3;

export const isBelowEasinessLevel = (id: CardId) => {
  return isEasinessLevelOn() && getSortKey(id) < getEasinessLevel();
};

export const getSortKeyAdjustedForEasinessLevel = (id: CardId) => {
  return getSortKeyAdjusted(id, getEasinessLevel());
};

export const getSortKeyAdjusted = (j) => {
  return getSortKey(id) > j ? getSortKey(id) : 100000 - getSortKey(id);
};
