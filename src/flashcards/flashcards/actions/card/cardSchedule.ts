import { getAllCardIdsWithSameTerm } from "flashcards/flashcards/actions/card/cardSiblings";
import { getAsCardInSession } from "flashcards/flashcards/actions/card/functions";
import { saveScheduleForCardId } from "flashcards/flashcards/actions/userData/userDataSchedule";
import { getEntireSchedule } from "flashcards/flashcards/actions/userData/userDataStore";
import {
  CardId,
  Rating,
  ScheduleData,
  Score,
} from "flashcards/flashcards/types/types";
import { minIgnoreFalsy, roundMsTo100Sec } from "modules/math";
import {
  Days,
  getTimeMemoized,
  Milliseconds,
  minutes,
  Timestamp,
} from "modules/time";

export const getScheduleForCard = (
  id: CardId
): Partial<ScheduleData> | undefined => {
  return getEntireSchedule()[id];
};

export function getDue(this: Card): Timestamp | undefined {
  return getScheduleForCard(id)?.due;
}

/**
 * @see Score
 */
export function getScore(this: Card): Score | undefined {
  return getScheduleForCard(id)?.score;
}

export function getSessionsSeen(this: Card): number {
  return getScheduleForCard(id)?.sessionsSeen || 0;
}

export function getNumberOfBadSessions(this: Card): number {
  return getScheduleForCard(id)?.numberOfBadSessions || 0;
}

export function getLastIntervalInDays(
  this: Card,
  id: CardId
): Days | undefined {
  return getScheduleForCard(id)?.lastIntervalInDays;
}

export function getLastSeen(this: Card): Timestamp | undefined {
  return getScheduleForCard(id)?.lastSeen;
}

export function isUnseenSiblingOfANonGoodCard(this: Card) {
  if (!isNewCard(id)) return false;
  const lowest = getLowestAvailableTermScore(id);
  return lowest && lowest < Rating.GOOD;
}

/**
 * Note that a card may be in the schedule without having been seen
 * (it may just have been postponed instead).
 */
export function isInSchedule(this: Card) {
  return id in getEntireSchedule();
}

export function setSchedule(
  this: Card,
  id: CardId,
  data: Partial<ScheduleData>
) {
  /* Round timestamps */
  ["due", "lastSeen", "lastBadTimestamp"].forEach((key) => {
    if (key in data) {
      // @ts-ignore
      data[key] = roundMsTo100Sec(data[key]);
    }
  });

  getEntireSchedule()[id] = {
    ...(getEntireSchedule()[id] || {}),
    ...data,
  };
  saveScheduleForCardId(id);
}

export function isUnseenTerm(this: Card) {
  return !getTermLastSeen(id);
}

export function getLowestAvailableTermScore(
  this: Card,
  id: CardId
): Score | null {
  let lowestScore: Score | null = null;
  getAllCardIdsWithSameTerm(id).forEach((card) => {
    if (getScore(card)) {
      lowestScore = minIgnoreFalsy(lowestScore, getScore(card));
    }
  });
  return lowestScore;
}

export function getTermLastSeen(this: Card): Timestamp | null {
  let max: Timestamp | null = null;
  getAllCardIdsWithSameTerm(id).forEach((card) => {
    max = Math.max(max || 0, getLastSeen(card) || 0);
  });
  return max;
}

export function timeSinceTermWasSeen(
  this: Card,
  id: CardId
): Milliseconds | null {
  let j = getTermLastSeen(id);
  if (!j) return null;
  return getTimeMemoized() - j;
}

/**
 * Whether a term was seen in the previous 45 minutes
 */
export function wasTermVeryRecentlySeen(this: Card) {
  return wasTermSeenMoreRecentlyThan(id, 45 * minutes);
}

/**
 * Input is a time span but not a timestamp,
 * e.g. "was this seen in the last day?".
 */
export function wasTermSeenMoreRecentlyThan(
  this: Card,
  id: CardId,
  time: Milliseconds
) {
  const i = timeSinceTermWasSeen(id);
  return i && i < time;
}

export function isNewCard(this: Card): boolean {
  return !getScore(id);
}

/**
 * Primarily used by the interface ({@link CardElement})
 * to indicate a card being new.
 */
export function isNewTermThatHasNotBeenSeenInSession(
  this: Card,
  cardId: CardId
) {
  return getAllCardIdsWithSameTerm(cardId).every((cardId2) => {
    return (
      isNewCard(cardId2) && !getAsCardInSession(cardId2)?.hasBeenSeenInSession()
    );
  });
}
