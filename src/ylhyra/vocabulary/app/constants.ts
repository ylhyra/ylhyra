export const USER_LEVEL_BEGINNER = 1;
export const USER_LEVEL_NOVICE = 2;
export const USER_LEVEL_INTERMEDIATE = 3;
export const USER_LEVEL_ADVANCED = 4;

export const NOT_DIFFICULT = 1;
export const DIFFICULT_FOR_BEGINNERS = 2;
export const DIFFICULT_FOR_INTERMEDIATE = 3;
export const DIFFICULT_FOR_ADVANCED = 4;
export enum DifficultyEnum {
  NOT_DIFFICULT = 1,
  DIFFICULT_FOR_BEGINNERS = 2,
  DIFFICULT_FOR_INTERMEDIATE = 3,
  DIFFICULT_FOR_ADVANCED = 4,
}

export const VERY_UNIMPORTANT = 1;
export const UNIMPORTANT = 2;
export const NORMAL_IMPORTANCE = 3;
export const IMPORTANT = 4;
export const VERY_IMPORTANT = 5;
export enum ImportanceEnum {
  VERY_UNIMPORTANT = 1,
  UNIMPORTANT = 2,
  NORMAL_IMPORTANCE = 3,
  IMPORTANT = 4,
  VERY_IMPORTANT = 5,
}

export const A1 = 1;
export const A2 = 2;
export const B1 = 3;
export const B2 = 4;
export const C1 = 5;
export const C2 = 6;
export enum LevelsEnum {
  A1 = 1,
  A2 = 2,
  B1 = 3,
  B2 = 4,
  C1 = 5,
  C2 = 6,
}

export type rating = number;
export const BAD: rating = 1;
export const GOOD: rating = 2;
export const EASY: rating = 3;
// export enum Rating {
//   BAD = 1,
//   GOOD = 2,
//   EASY = 3,
// }