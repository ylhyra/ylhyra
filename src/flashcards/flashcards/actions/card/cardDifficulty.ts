import { Card } from "flashcards/flashcards/actions/card/card";
import { Rating } from "flashcards/flashcards/types/types";
import { SCORE_IS_INCREMENTED_BY_HOW_MUCH_IF_RATED_GOOD_OR_EASY } from "flashcards/flashcards/actions/createSchedule/createSchedule";
import {
  getLowestAvailableTermScore,
  getScore,
  getSessionsSeen,
} from "flashcards/flashcards/actions/card/cardSchedule";

/**
 * Used by {@link oldCards} when classifying which already-seen
 * cards should be chosen.
 *
 * TODO: This needs to be reworked, it currently only checks whether
 * it has been seen once and was then given an easy rating.
 */
export function isTooEasy(this: Card) {
  const score = getScore(cardId);
  return score && score >= Rating.EASY && getSessionsSeen(cardId) === 1;
}

/**
 * Used by {@link oldCards} when classifying which already-seen
 * cards should be chosen.
 *
 * A card will have score of "1" (Rating.BAD)
 * if it was rated as bad the last time it was seen.
 * See {@link Score}.
 */
export function isBad(this: Card) {
  return getScore(cardId) === Rating.BAD;
}
export function isFairlyBad(this: Card) {
  const score = getScore(cardId);
  return (
    score &&
    score <= Rating.BAD + SCORE_IS_INCREMENTED_BY_HOW_MUCH_IF_RATED_GOOD_OR_EASY
  );
}
export function isBelowGood(this: Card) {
  const score = getScore(cardId) || getLowestAvailableTermScore(cardId);
  return score && score < Rating.GOOD;
}
