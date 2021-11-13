import { minIgnoreFalsy, roundMsTo100Sec } from "app/app/functions/math";
import { getTimeMemoized, minutes } from "app/app/functions/time";
import { CardId } from "app/vocabulary/actions/card/card";
import { getSchedule, getTerms } from "app/vocabulary/actions/card/card_data";
import { BAD, EASY, GOOD } from "app/vocabulary/actions/card/card_difficulty";
import { deck } from "app/vocabulary/actions/deck";
import {
  getAllCardIdsWithSameTerm,
  getAsCardInSession,
} from "app/vocabulary/actions/card/card_siblings";
import { saveScheduleForCardId } from "app/vocabulary/actions/userData/userDataSchedule";
import { INCR } from "app/vocabulary/actions/createSchedule";

export const getScore = (id: CardId) => {
  return getSchedule(id)?.score;
};

export const getSessionsSeen = (id: CardId) => {
  return getSchedule(id)?.sessions_seen || 0;
};

export const getLastIntervalInDays = (id: CardId) => {
  return getSchedule(id)?.last_interval_in_days;
};

export const getLastSeen = (id: CardId) => {
  return getSchedule(id)?.last_seen;
};

export const isTooEasy = (id: CardId) => {
  return getScore(id) >= EASY && getSessionsSeen(id) === 1;
};

export const isBad = (id: CardId) => {
  return getScore(id) === BAD;
};

export const isFairlyBad = (id: CardId) => {
  return getScore(id) && getScore(id) <= BAD + INCR;
};

export const isBelowGood = (id: CardId) => {
  const j = getScore(id) || getLowestAvailableTermScore(id);
  return j && j < GOOD;
};

export const isUnseenCard = (id: CardId) => {
  return !getScore(id);
};

export const isUnseenSiblingOfANonGoodCard = (id: CardId) => {
  if (!isUnseenCard(id)) return false;
  const l = getLowestAvailableTermScore(id);
  return l && l < GOOD;
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

export const isInSchedule = (id: CardId) => {
  return id in deck.schedule;
};

export const isNewCard = (id: CardId) => {
  return !isInSchedule(id);
};

export const setSchedule = (id, data) => {
  if (data.due) {
    data.due = roundMsTo100Sec(data.due);
  }
  if (data.last_seen) {
    data.last_seen = roundMsTo100Sec(data.last_seen);
  }

  deck.schedule[id] = {
    ...(deck.schedule[id] || {}),
    ...data,
  };
  saveScheduleForCardId(id);
};

export const isNewTerm = (id: CardId) => {
  // There exists at least one term
  return getTermIds(id).some((term) =>
    // Where every cardInSession is new
    term
      .getCards()
      .every(
        (card) =>
          !isInSchedule(card) &&
          !getAsCardInSession(card)?.hasBeenSeenInSession()
      )
  );
};
