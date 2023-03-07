// @ts-nocheck
import {
  clamp,
  mapValueToRange,
  mapZeroToInfinityToZeroToOne,
} from "modules/math";
import { day, days } from "modules/time";
import _ from "underscore";
import { Props as ActivityCalendarProps } from "modules/react-activity-calendar/component/ActivityCalendar";
import { store } from "flashcards/store";

const MIN_DAYS_TO_SHOW = 2.5 * 30;
const MAX_DAYS_TO_SHOW = 365;

export class ActivityCalendarOverview {
  streak;
  secondsSpentTotal;
  secondsSpentThisWeek;
  calendarData: ActivityCalendarProps["CalendarData"];

  constructor() {
    let secondsSpentTotal = 0;
    let secondsSpentThisWeek = 0;
    const daysAgoToSecondsSpent = {};

    /* Get timestamp for the last 04:00 */
    let todayBeginsAtTimestamp = getTodayBeginsAtTimestamp();

    [...store.sessionLog.values()].forEach((sessionLogData) => {
      /* Today is 0 days ago */
      const daysAgo =
        Math.ceil(
          (todayBeginsAtTimestamp - sessionLogData.timestamp) / days + 1,
        ) - 1;
      daysAgoToSecondsSpent[daysAgo] =
        (daysAgoToSecondsSpent[daysAgo] || 0) + sessionLogData.secondsSpent;
      secondsSpentTotal += sessionLogData.secondsSpent;
      if (daysAgo <= 6) {
        secondsSpentThisWeek += sessionLogData.secondsSpent;
      }
    });

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

    /* Count backwards the number of days to show in the calendar */
    let numberOfDaysToShowInCalendar = clamp(
      _.max(Object.keys(daysAgoToSecondsSpent).map((i) => parseInt(i))) + 7,
      MIN_DAYS_TO_SHOW,
      MAX_DAYS_TO_SHOW,
    );

    /* Make sure the calendar shown starts on a Sunday */
    numberOfDaysToShowInCalendar += new Date(
      todayBeginsAtTimestamp - numberOfDaysToShowInCalendar * days,
    ).getDay() /* getDay counts the number of days since Sunday */;

    let calendarData: ActivityCalendarProps["CalendarData"] = [];
    for (let daysAgo = numberOfDaysToShowInCalendar; daysAgo >= 0; daysAgo--) {
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

    this.streak = streak;
    this.secondsSpentTotal = secondsSpentTotal;
    this.secondsSpentThisWeek = secondsSpentThisWeek;
    this.calendarData = calendarData;
  }
}

const getTodayBeginsAtTimestamp = () => {
  /** The day starts at 04:00 local time */
  const DAY_STARTS_AT = 4;
  const now = new Date();

  let todayBeginsAtTimestamp = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    DAY_STARTS_AT,
    0,
    0,
  ).getTime();
  /* Go back one day if it's past midnight for the user but not yet 04:00 */
  if (now.getTime() < todayBeginsAtTimestamp) {
    todayBeginsAtTimestamp -= day;
  }
  return todayBeginsAtTimestamp;
};
