import { INCR } from "app/vocabulary/actions/createSchedule";
import {
  getLowestAvailableTermScore,
  getScore,
  getSessionsSeen,
} from "app/vocabulary/actions/card/card_schedule";
import { CardId } from "app/vocabulary/actions/card/types";
import { BAD, EASY, GOOD } from "app/vocabulary/constants";

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
