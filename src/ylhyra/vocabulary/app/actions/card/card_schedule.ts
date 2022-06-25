import { minIgnoreFalsy, roundMsTo100Sec } from "modules/math";
import {
  getTimeMemoized,
  Milliseconds,
  minutes,
  Timestamp,
} from "modules/time";
import { getTermIds } from "ylhyra/vocabulary/app/actions/card/card_data";
import {
  getAllCardIdsWithSameTerm,
  getAsCardInSession,
} from "ylhyra/vocabulary/app/actions/card/card_siblings";
import { getCardIdsFromTermId } from "ylhyra/vocabulary/app/actions/card/term";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { saveScheduleForCardId } from "ylhyra/vocabulary/app/actions/userData/userDataSchedule";
import { GOOD } from "ylhyra/vocabulary/app/constants";
import { CardId, ScheduleData } from "ylhyra/vocabulary/types";

export const getSchedule = (id: CardId): Partial<ScheduleData> | undefined => {
  if (!deck) {
    console.error("Deck not initialized");
    return;
  }
  return deck!.schedule[id];
};

export const getDue = (id: CardId): Timestamp | undefined => {
  return getSchedule(id)?.due;
};

export function getScore(id: CardId) {
  return getSchedule(id)?.score;
}

export function getSessionsSeen(id: CardId) {
  return getSchedule(id)?.sessions_seen || 0;
}

export function getNumberOfBadSessions(id: CardId) {
  return getSchedule(id)?.number_of_bad_sessions || 0;
}

export function getLastIntervalInDays(id: CardId) {
  return getSchedule(id)?.last_interval_in_days;
}

export function getLastSeen(id: CardId) {
  return getSchedule(id)?.last_seen;
}

export function isUnseenCard(id: CardId) {
  return !getScore(id);
}

export function isUnseenSiblingOfANonGoodCard(id: CardId) {
  if (!isUnseenCard(id)) return false;
  const l = getLowestAvailableTermScore(id);
  return l && l < GOOD;
}

export function isInSchedule(id: CardId) {
  if (!deck) {
    console.error("Deck not initialized");
    return;
  }
  return id in deck!.schedule;
}

export function setSchedule(id: CardId, data: Partial<ScheduleData>) {
  if (!deck) {
    console.error("Deck not initialized");
    return;
  }

  /* Round timestamps */
  ["due", "last_seen", "last_bad_timestamp"].forEach((key) => {
    if (key in data) {
      // @ts-ignore
      data[key] = roundMsTo100Sec(data[key]);
    }
  });

  deck!.schedule[id] = {
    ...(deck!.schedule[id] || {}),
    ...data,
  };
  saveScheduleForCardId(id);
}

export function isUnseenTerm(id: CardId) {
  return !getTermLastSeen(id);
}

export function getLowestAvailableTermScore(id: CardId) {
  let lowest: number | null = null;
  getAllCardIdsWithSameTerm(id).forEach((card) => {
    if (getScore(card)) {
      lowest = minIgnoreFalsy(lowest, getScore(card));
    }
  });
  return lowest;
}

export function getTermLastSeen(id: CardId) {
  // return memoize(id, "getTermLastSeen", () => {
  let max = 0;
  getAllCardIdsWithSameTerm(id).forEach((card) => {
    max = Math.max(max, getLastSeen(card) || 0);
  });
  return max;
  // });
}

export const timeSinceTermWasSeen = (id: CardId): Milliseconds | null => {
  let j = getTermLastSeen(id);
  if (!j) return null;
  return getTimeMemoized() - j;
};

export function wasTermVeryRecentlySeen(id: CardId) {
  return wasTermSeenMoreRecentlyThan(id, 45 * minutes);
}

export function wasTermSeenMoreRecentlyThan(id: CardId, time: Timestamp) {
  const i = timeSinceTermWasSeen(id);
  return i && i < time;
}

export function isNewCard(id: CardId) {
  return !isInSchedule(id);
}

export function isNewTerm(id: CardId) {
  // There exists at least one term
  return getTermIds(id).some((term) =>
    // Where every cardInSession is new
    getCardIdsFromTermId(term).every(
      (id) =>
        !isInSchedule(id) && !getAsCardInSession(id)?.hasBeenSeenInSession()
    )
  );
}
