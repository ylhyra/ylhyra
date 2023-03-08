import { getLowestAvailableRowScore } from "flashcards/flashcards/actions/card/cardSchedule";
import { Card } from "flashcards/flashcards/actions/card/card";
import { SCORE_IS_INCREMENTED_BY_HOW_MUCH_IF_RATED_GOOD_OR_EASY } from "flashcards/flashcards/actions/createSchedule/createSchedule";
import { Rating } from "flashcards/flashcards/types";

/**
 * Used by {@link oldCards} when classifying which already-seen cards should be chosen.
 *
 * A card will have score of "1" (Rating.BAD) if it was rated as bad the last
 * time it was seen. See {@link Score}.
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

export function isBelowGood(card1: Card): Boolean {
  const score = card1.score || getLowestAvailableRowScore(card1);
  return Boolean(score && score < Rating.GOOD);
}
