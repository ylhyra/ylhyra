import { minIgnoreFalsy, roundMsTo100Sec } from "app/app/functions/math";
import { getTimeMemoized, minutes, Timestamp } from "app/app/functions/time";
import { getTermIds } from "app/vocabulary/actions/card/card_data";
import { deck } from "app/vocabulary/actions/deck";
import {
  getAllCardIdsWithSameTerm,
  getAsCardInSession,
} from "app/vocabulary/actions/card/card_siblings";
import { saveScheduleForCardId } from "app/vocabulary/actions/userData/userDataSchedule";
import { getCardIdsFromTermId } from "app/vocabulary/actions/card/term";
import { CardId, ScheduleData } from "app/vocabulary/actions/card/types";
import { GOOD } from "app/vocabulary/constants";

export const getSchedule = (id: CardId): ScheduleData | null => {
  return deck.schedule[id];
};

export const getDue = (id: CardId): Timestamp | null => {
  return getSchedule(id)?.due;
};

export const getScore = (id: CardId) => {
  return getSchedule(id)?.score;
};

export const getSessionsSeen = (id: CardId) => {
  return getSchedule(id)?.sessions_seen || 0;
};

export const getNumberOfBadSessions = (id: CardId) => {
  return getSchedule(id)?.number_of_bad_sessions || 0;
};

export const getLastIntervalInDays = (id: CardId) => {
  return getSchedule(id)?.last_interval_in_days;
};

export const getLastSeen = (id: CardId) => {
  return getSchedule(id)?.last_seen;
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
  return id in deck.schedule;
};

export const setSchedule = (id, data: Partial<ScheduleData>) => {
  /* Round timestamps */
  ["due", "last_seen", "last_bad_timestamp"].forEach((key) => {
    if (data[key]) {
      data[key] = roundMsTo100Sec(data[key]);
    }
  });

  deck.schedule[id] = {
    ...(deck.schedule[id] || {}),
    ...data,
  };
  saveScheduleForCardId(id);
};

export const isUnseenTerm = (id: CardId) => {
  return !getTermLastSeen(id);
};

export const getLowestAvailableTermScore = (id: CardId) => {
  let lowest;
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

export const timeSinceTermWasSeen = (id: CardId) => {
  let j = getTermLastSeen(id);
  if (!j) return null;
  return getTimeMemoized() - j;
};

export const wasTermVeryRecentlySeen = (id: CardId) => {
  return wasTermSeenMoreRecentlyThan(id, 45 * minutes);
};

export const wasTermSeenMoreRecentlyThan = (id: CardId, time) => {
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
