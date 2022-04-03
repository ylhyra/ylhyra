export const USER_LEVEL_BEGINNER = 1;
export const USER_LEVEL_NOVICE = 2;
export const USER_LEVEL_INTERMEDIATE = 3;
export const USER_LEVEL_ADVANCED = 4;

export const NOT_DIFFICULT = 1;
export const DIFFICULT_FOR_BEGINNERS = 2;
export const DIFFICULT_FOR_INTERMEDIATE = 3;
export const DIFFICULT_FOR_ADVANCED = 4;
export enum DifficultyEnum {
  NOT_DIFFICULT,
  DIFFICULT_FOR_BEGINNERS,
  DIFFICULT_FOR_INTERMEDIATE,
  DIFFICULT_FOR_ADVANCED,
}

export const VERY_UNIMPORTANT = 1;
export const UNIMPORTANT = 2;
export const NORMAL_IMPORTANCE = 3;
export const IMPORTANT = 4;
export const VERY_IMPORTANT = 5;
export enum ImportanceEnum {
  VERY_UNIMPORTANT,
  UNIMPORTANT,
  NORMAL_IMPORTANCE,
  IMPORTANT,
  VERY_IMPORTANT,
}

export const A1 = 1;
export const A2 = 2;
export const B1 = 3;
export const B2 = 4;
export const C1 = 5;
export const C2 = 6;
export enum LevelsEnum {
  A1,
  A2,
  B1,
  B2,
  C1,
  C2,
}

export type rating = number;
export const BAD: rating = 1;
export const GOOD: rating = 2;
export const EASY: rating = 3;
