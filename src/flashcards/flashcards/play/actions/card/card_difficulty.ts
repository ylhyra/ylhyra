import {
  getLowestAvailableTermScore,
  getScore,
  getSessionsSeen,
} from "flashcards/flashcards/play/actions/card/card_schedule";
import { INCR } from "flashcards/flashcards/play/actions/createSchedule";
import { BAD, EASY, GOOD } from "ylhyra/vocabulary/app/constants";

export const isTooEasy = (id: CardId) => {
  return getScore(id) && getScore(id)! >= EASY && getSessionsSeen(id) === 1;
};
export const isBad = (id: CardId) => {
  return getScore(id) === BAD;
};
export const isFairlyBad = (id: CardId) => {
  return getScore(id) && getScore(id)! <= BAD + INCR;
};
export const isBelowGood = (id: CardId) => {
  const j = getScore(id) || getLowestAvailableTermScore(id);
  return j && j < GOOD;
};
