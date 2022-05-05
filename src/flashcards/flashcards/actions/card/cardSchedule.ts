import { getTermIds } from "flashcards/flashcards/actions/card/cardData";
import {
  getAllCardIdsWithSameTerm,
  getAsCardInSession,
} from "flashcards/flashcards/actions/card/cardSiblings";
import { getCardIdsFromTermId } from "flashcards/flashcards/actions/card/term";
import { saveScheduleForCardId } from "flashcards/flashcards/actions/userData/userDataSchedule";
import { CardId, ScheduleData } from "flashcards/flashcards/types/types";
import { minIgnoreFalsy, roundMsTo100Sec } from "modules/math";
import {
  getTimeMemoized,
  Milliseconds,
  minutes,
  Timestamp,
} from "modules/time";
import { GOOD } from "ylhyra/vocabulary/app/constants";

export const getScheduleForCard = (
  id: CardId
): Partial<ScheduleData> | undefined => {
  if (!deck) {
    console.error("Deck not initialized");
    return;
  }
  return getEntireSchedule()[id];
};

export const getDue = (id: CardId): Timestamp | undefined => {
  return getScheduleForCard(id)?.due;
};

export const getScore = (id: CardId) => {
  return getScheduleForCard(id)?.score;
};

export const getSessionsSeen = (id: CardId) => {
  return getScheduleForCard(id)?.sessionsSeen || 0;
};

export const getNumberOfBadSessions = (id: CardId) => {
  return getScheduleForCard(id)?.numberOfBadSessions || 0;
};

export const getLastIntervalInDays = (id: CardId) => {
  return getScheduleForCard(id)?.lastIntervalInDays;
};

export const getLastSeen = (id: CardId) => {
  return getScheduleForCard(id)?.lastSeen;
};

export const isUnseenCard = (id: CardId) => {
  return !getScore(id);
};

export const isUnseenSiblingOfANonGoodCard = (id: CardId) => {
  if (!isUnseenCard(id)) return false;
  const l = getLowestAvailableTermScore(id);
  return l && l < GOOD;
};

export const isInSchedule = (id: CardId) => {
  if (!deck) {
    console.error("Deck not initialized");
    return;
  }
  return id in getEntireSchedule();
};

export const setSchedule = (id: CardId, data: Partial<ScheduleData>) => {
  if (!deck) {
    console.error("Deck not initialized");
    return;
  }

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

export const getLowestAvailableTermScore = (id: CardId) => {
  let lowest: number | null = null;
  getAllCardIdsWithSameTerm(id).forEach((card) => {
    if (getScore(card)) {
      lowest = minIgnoreFalsy(lowest, getScore(card));
    }
  });
  return lowest;
};

export const getTermLastSeen = (id: CardId) => {
  // return memoize(id, "getTermLastSeen", () => {
  let max = 0;
  getAllCardIdsWithSameTerm(id).forEach((card) => {
    max = Math.max(max, getLastSeen(card) || 0);
  });
  return max;
  // });
};

export const timeSinceTermWasSeen = (id: CardId): Milliseconds | null => {
  let j = getTermLastSeen(id);
  if (!j) return null;
  return getTimeMemoized() - j;
};

export const wasTermVeryRecentlySeen = (id: CardId) => {
  return wasTermSeenMoreRecentlyThan(id, 45 * minutes);
};

export const wasTermSeenMoreRecentlyThan = (id: CardId, time: Timestamp) => {
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
