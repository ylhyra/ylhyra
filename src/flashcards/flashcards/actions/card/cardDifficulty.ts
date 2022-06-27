import { Card } from "flashcards/flashcards/actions/card/card";
import { SCORE_IS_INCREMENTED_BY_HOW_MUCH_IF_RATED_GOOD_OR_EASY } from "flashcards/flashcards/actions/createSchedule/createSchedule";
import { Rating } from "flashcards/flashcards/types";

/**
 * Used by {@link oldCards} when classifying which already-seen
 * cards should be chosen.
 *
 * TODO: card1 needs to be reworked, it currently only checks
 * whether it has been seen once and was then given an easy rating.
 */
export function isTooEasy(card1: Card) {
  const score = card1.score;
  return score && score >= Rating.EASY && card1.sessionsSeen === 1;
}

/**
 * Used by {@link oldCards} when classifying which
 * already-seen cards should be chosen.
 *
 * A card will have score of "1" (Rating.BAD) if
 * it was rated as bad the last time it was seen.
 * See {@link Score}.
 */
export function isBad(card1: Card) {
  return card1.score === Rating.BAD;
}
export function isFairlyBad(card1: Card) {
  const score = card1.score;
  return (
    score &&
    score <= Rating.BAD + SCORE_IS_INCREMENTED_BY_HOW_MUCH_IF_RATED_GOOD_OR_EASY
  );
}
export function isBelowGood(card1: Card) {
  const score = card1.score || card1.getLowestAvailableRowScore();
  return score && score < Rating.GOOD;
}
