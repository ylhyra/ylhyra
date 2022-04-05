import {
  getLowestAvailableTermScore,
  getScore,
  getSessionsSeen,
} from "ylhyra/app/vocabulary/actions/card/card_schedule";
import { CardId } from "ylhyra/app/vocabulary/actions/card/types";
import { INCR } from "ylhyra/app/vocabulary/actions/createSchedule";
import { BAD, EASY, GOOD } from "ylhyra/app/vocabulary/constants";

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
