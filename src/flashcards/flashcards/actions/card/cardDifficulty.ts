import {
  getLowestAvailableTermScore,
  getScore,
  getSessionsSeen,
} from "flashcards/flashcards/actions/card/cardSchedule";
import { INCR } from "flashcards/flashcards/actions/createSchedule";
import { CardId, Rating } from "flashcards/flashcards/types/types";

export const isTooEasy = (id: CardId) => {
  return (
    getScore(id) && getScore(id)! >= Rating.EASY && getSessionsSeen(id) === 1
  );
};
export const isBad = (id: CardId) => {
  return getScore(id) === Rating.BAD;
};
export const isFairlyBad = (id: CardId) => {
  return getScore(id) && getScore(id)! <= Rating.BAD + INCR;
};
export const isBelowGood = (id: CardId) => {
  const j = getScore(id) || getLowestAvailableTermScore(id);
  return j && j < Rating.GOOD;
};
