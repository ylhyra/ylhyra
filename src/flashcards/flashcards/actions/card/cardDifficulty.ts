import {
  getLowestAvailableTermScore,
  getScore,
  getSessionsSeen,
} from "flashcards/flashcards/actions/card/cardSchedule";
import { INCR } from "flashcards/flashcards/actions/createSchedule";
import { CardId, Rating } from "flashcards/flashcards/types/types";

export const isTooEasy = (cardId: CardId) => {
  return (
    getScore(cardId) &&
    getScore(cardId)! >= Rating.EASY &&
    getSessionsSeen(cardId) === 1
  );
};
export const isBad = (cardId: CardId) => {
  return getScore(cardId) === Rating.BAD;
};
export const isFairlyBad = (cardId: CardId) => {
  return getScore(cardId) && getScore(cardId)! <= Rating.BAD + INCR;
};
export const isBelowGood = (cardId: CardId) => {
  const j = getScore(cardId) || getLowestAvailableTermScore(cardId);
  return j && j < Rating.GOOD;
};
