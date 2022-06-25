import {
  getLowestAvailableTermScore,
  getScore,
  getSessionsSeen,
} from "ylhyra/vocabulary/app/actions/card/card_schedule";
import { INCR } from "ylhyra/vocabulary/app/actions/createSchedule";
import { BAD, EASY, GOOD } from "ylhyra/vocabulary/app/constants";
import { CardId } from "ylhyra/vocabulary/types";

export function isTooEasy(id: CardId) {
  return getScore(id) && getScore(id)! >= EASY && getSessionsSeen(id) === 1;
}
export function isBad(id: CardId) {
  return getScore(id) === BAD;
}
export function isFairlyBad(id: CardId) {
  return getScore(id) && getScore(id)! <= BAD + INCR;
}
export function isBelowGood(id: CardId) {
  const j = getScore(id) || getLowestAvailableTermScore(id);
  return j && j < GOOD;
}
