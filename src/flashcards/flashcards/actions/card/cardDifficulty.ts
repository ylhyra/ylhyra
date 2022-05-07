import {
  getLowestAvailableTermScore,
  getScore,
  getSessionsSeen,
} from "flashcards/flashcards/actions/card/cardSchedule";
import { INCR } from "flashcards/flashcards/actions/createSchedule";
import { CardId, Rating } from "flashcards/flashcards/types/types";

/**
 * Used by {@link oldCards} when classifying which already-seen
 * cards shoud be chosen.
 */
export const isTooEasy = (cardId: CardId) => {
  const score = getScore(cardId);

  return score && score >= Rating.EASY && getSessionsSeen(cardId) === 1;
};

/**
 * Used by {@link oldCards} when classifying which already-seen
 * cards shoud be chosen.
 */
export const isBad = (cardId: CardId) => {
  return getScore(cardId) === Rating.BAD;
};
export const isFairlyBad = (cardId: CardId) => {
  const score = getScore(cardId);
  return score && score <= Rating.BAD + INCR;
};
export const isBelowGood = (cardId: CardId) => {
  const score = getScore(cardId) || getLowestAvailableTermScore(cardId);
  return score && score < Rating.GOOD;
};
