import { getTermIds } from "flashcards/flashcards/actions/card/cardData";
import { getAllCardIdsWithSameTerm } from "flashcards/flashcards/actions/card/cardSiblings";
import { getCardIdsFromTermId } from "flashcards/flashcards/actions/card/term";
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

export const isUnseenCard = (id: CardId): boolean => {
  return !getScore(id);
};

export const isUnseenSiblingOfANonGoodCard = (id: CardId) => {
  if (!isUnseenCard(id)) return false;
  const l = getLowestAvailableTermScore(id);
  return l && l < Rating.GOOD;
};

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

export const wasTermVeryRecentlySeen = (id: CardId) => {
  return wasTermSeenMoreRecentlyThan(id, 45 * minutes);
};

export const wasTermSeenMoreRecentlyThan = (id: CardId, time: Milliseconds) => {
  const i = timeSinceTermWasSeen(id);
  return i && i < time;
};

export const isNewCard = (id: CardId) => {
  return !isInSchedule(id);
};

export const isNewTerm = (id: CardId) => {
  // There exists at least one term
  return getTermIds(id).some((term) =>
    // Where every cardInSession is new
    getCardIdsFromTermId(term).every(
      (id) =>
        !isInSchedule(id) && !getAsCardInSession(id)?.hasBeenSeenInSession()
    )
  );
};
