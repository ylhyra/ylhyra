export const BAD = 1;
export const GOOD = 2;
export const EASY = 3;

export const isBelowEasinessLevel = (id: CardId) => {
  return isEasinessLevelOn() && getSortKey(id) < getEasinessLevel();
};

export const getSortKeyAdjustedForEasinessLevel = (id: CardId) => {
  return getSortKeyAdjusted(id, getEasinessLevel());
};

export const getSortKeyAdjusted = (j) => {
  return getSortKey(id) > j ? getSortKey(id) : 100000 - getSortKey(id);
};
