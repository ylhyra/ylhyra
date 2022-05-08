import { getAllCardIdsWithSameTerm } from "flashcards/flashcards/actions/card/cardSiblings";
import { saveScheduleForCardId } from "flashcards/flashcards/actions/userData/userDataSchedule";
import {
  CardId,
  Rating,
  ScheduleData,
  Score,
} from "flashcards/flashcards/types/types";
import { getEntireSchedule } from "flashcards/flashcards/userDataStore";
import { minIgnoreFalsy, roundMsTo100Sec } from "modules/math";
import {
  Days,
  getTimeMemoized,
  Milliseconds,
  minutes,
  Timestamp,
} from "modules/time";
import { getAsCardInSession } from "flashcards/flashcards/actions/card/functions";

export const getScheduleForCard = (
  id: CardId
): Partial<ScheduleData> | undefined => {
  return getEntireSchedule()[id];
};

export const getDue = (id: CardId): Timestamp | undefined => {
  return getScheduleForCard(id)?.due;
};

/**
 * @see Score
 */
export const getScore = (id: CardId): Score | undefined => {
  return getScheduleForCard(id)?.score;
};

export const getSessionsSeen = (id: CardId): number => {
  return getScheduleForCard(id)?.sessionsSeen || 0;
};

export const getNumberOfBadSessions = (id: CardId): number => {
  return getScheduleForCard(id)?.numberOfBadSessions || 0;
};

export const getLastIntervalInDays = (id: CardId): Days | undefined => {
  return getScheduleForCard(id)?.lastIntervalInDays;
};

export const getLastSeen = (id: CardId): Timestamp | undefined => {
  return getScheduleForCard(id)?.lastSeen;
};

export const isUnseenSiblingOfANonGoodCard = (id: CardId) => {
  if (!isNewCard(id)) return false;
  const lowest = getLowestAvailableTermScore(id);
  return lowest && lowest < Rating.GOOD;
};

/**
 * Note that a card may be in the schedule without having been seen
 * (it may just have been postponed instead).
 */
export const isInSchedule = (id: CardId) => {
  return id in getEntireSchedule();
};

export const setSchedule = (id: CardId, data: Partial<ScheduleData>) => {
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
};

export const isUnseenTerm = (id: CardId) => {
  return !getTermLastSeen(id);
};

export const getLowestAvailableTermScore = (id: CardId): Score | null => {
  let lowestScore: Score | null = null;
  getAllCardIdsWithSameTerm(id).forEach((card) => {
    if (getScore(card)) {
      lowestScore = minIgnoreFalsy(lowestScore, getScore(card));
    }
  });
  return lowestScore;
};

export const getTermLastSeen = (id: CardId): Timestamp | null => {
  let max: Timestamp | null = null;
  getAllCardIdsWithSameTerm(id).forEach((card) => {
    max = Math.max(max || 0, getLastSeen(card) || 0);
  });
  return max;
};

export const timeSinceTermWasSeen = (id: CardId): Milliseconds | null => {
  let j = getTermLastSeen(id);
  if (!j) return null;
  return getTimeMemoized() - j;
};

/**
 * Whether a term was seen in the previous 45 minutes
 */
export const wasTermVeryRecentlySeen = (id: CardId) => {
  return wasTermSeenMoreRecentlyThan(id, 45 * minutes);
};

/**
 * Input is a time span but not a timestamp,
 * e.g. "was this seen in the last day?".
 */
export const wasTermSeenMoreRecentlyThan = (id: CardId, time: Milliseconds) => {
  const i = timeSinceTermWasSeen(id);
  return i && i < time;
};

export const isNewCard = (id: CardId): boolean => {
  return !getScore(id);
};

/**
 * Primarily used by the interface ({@link CardElement})
 * to indicate a card being new.
 */
export const isNewTermThatHasNotBeenSeenInSession = (cardId: CardId) => {
  return getAllCardIdsWithSameTerm(cardId).every((cardId2) => {
    return (
      isNewCard(cardId2) && !getAsCardInSession(cardId2)?.hasBeenSeenInSession()
    );
  });
};
