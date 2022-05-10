import {
  clamp,
  mapValueToRange,
  mapZeroToInfinityToZeroToOne,
} from "modules/math";
import { day, days } from "modules/time";
import _ from "underscore";
import store from "ylhyra/app/app/store";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { PercentageKnownOverall } from "ylhyra/vocabulary/app/actions/functions/percentageKnown";
import { getSessions } from "ylhyra/vocabulary/app/actions/userData/userDataSessions";

const MIN_DAYS_TO_SHOW = 2.5 * 30;
const MAX_DAYS_TO_SHOW = 365;

export const clearOverview = () => {
  store.dispatch({
    type: "LOAD_OVERVIEW",
    content: {
      loaded: false,
    },
  });
};

export const calculateOverview = async () => {
  if (!deck) return null;

  let secondsSpentTotal = 0;
  let secondsSpentThisWeek = 0;
  const daysAgoToSecondsSpent = {};

  /* Get timestamp for the last 04:00 */
  let todayBeginsAtTimestamp = getTodayBeginsAtTimestamp();

  getSessions().forEach((session) => {
    /* Today is 0 days ago */
    const daysAgo =
      Math.ceil((todayBeginsAtTimestamp - session.timestamp) / days + 1) - 1;
    daysAgoToSecondsSpent[daysAgo] =
      (daysAgoToSecondsSpent[daysAgo] || 0) + session.seconds_spent;
    secondsSpentTotal += session.seconds_spent;
    if (daysAgo <= 6) {
      secondsSpentThisWeek += session.seconds_spent;
    }
  });

  /* Count backwards the number of days to show in the calendar */
  let daysToShowInCalendar = clamp(
    _.max(Object.keys(daysAgoToSecondsSpent).map((i) => parseInt(i))) + 7,
    MIN_DAYS_TO_SHOW,
    MAX_DAYS_TO_SHOW
  );

  /* Make sure the calendar shown starts on a Sunday */
  daysToShowInCalendar += new Date(
    todayBeginsAtTimestamp - daysToShowInCalendar * days
  ).getDay() /* getDay counts the number of days since Sunday */;

  let calendarData = [];
  for (let daysAgo = daysToShowInCalendar; daysAgo >= 0; daysAgo--) {
    const seconds = daysAgoToSecondsSpent[daysAgo] || 0;
    const minutes = seconds / 60;

    let opacity = 0;
    if (minutes) {
      opacity = mapValueToRange({
        value: mapZeroToInfinityToZeroToOne({
          input: minutes,
          /* Spending 40 minutes fills eighty percent */
          goalInput: 40,
          goalOutput: 0.8,
        }),
        inputFrom: 0,
        inputTo: 1,
        outputFrom: 0.2,
        outputTo: 1,
      });
    }

    calendarData.push({
      count: Math.ceil(seconds / 60),
      date: new Date(todayBeginsAtTimestamp - daysAgo * days)
        .toISOString()
        .substring(0, 10),
      /* Level from 0 to 1 */
      level: Math.min(opacity, 1),
    });
  }

  let streak = 0;
  for (
    let daysAgo = 0;
    daysAgo === 0 || daysAgoToSecondsSpent[daysAgo];
    daysAgo++
  ) {
    if (daysAgoToSecondsSpent[daysAgo]) {
      streak++;
    }
  }
  /* A one-day streak does not count */
  if (streak === 1) streak = 0;

  store.dispatch({
    type: "LOAD_OVERVIEW",
    content: {
      streak,
      seconds_spent_total: secondsSpentTotal,
      seconds_spent_this_week: secondsSpentThisWeek,
      calendar_data: calendarData,
      percentage_known_overall: PercentageKnownOverall(),
      loaded: true,
    },
  });
};

/**
 * The day starts at 04:00 local time
 */
const getTodayBeginsAtTimestamp = () => {
  const now = new Date();

  let todayBeginsAtTimestamp = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    DAY_STARTS_AT,
    0,
    0
  ).getTime();
  /* Go back one day if it's past midnight for the user but not yet 04:00 */
  if (now.getTime() < todayBeginsAtTimestamp) {
    todayBeginsAtTimestamp -= day;
  }
  return todayBeginsAtTimestamp;
};
const DAY_STARTS_AT = 4; /*  */
