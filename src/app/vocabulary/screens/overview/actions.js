import { day, days } from "app/app/functions/time";
import { getSessions } from "app/vocabulary/actions/sync";
import { clamp, mapZeroToInfinityToZeroToOne } from "app/app/functions/math";
import _ from "underscore";
import { EACH_SESSION_LASTS_X_MINUTES } from "app/app/constants";
import { deck } from "app/vocabulary/actions/deck";
import store from "app/app/store";

const MIN_DAYS_TO_SHOW = 2.5 * 30;
const MAX_DAYS_TO_SHOW = 365;

export const calculateOverview = () => {
  if (!deck) return null;

  let seconds_spent_total = 0;
  let seconds_spent_this_week = 0;
  const days_ago_to_seconds_spent = {};

  /* Get timestamp for the last 04:00 */
  let today_begins_at_timestamp = get_today_begins_at_timestamp();

  getSessions().forEach((session) => {
    /* Today is 0 days ago */
    const days_ago =
      Math.ceil((today_begins_at_timestamp - session.timestamp) / days + 1) - 1;
    days_ago_to_seconds_spent[days_ago] =
      (days_ago_to_seconds_spent[days_ago] || 0) + session.seconds_spent;
    seconds_spent_total += session.seconds_spent;
    /* TODO: Ætti að telja sjöunda daginn bara ef ekkert hefur verið gert í dag, hægt að færa niður í streaks */
    if (days_ago <= 7) {
      seconds_spent_this_week += session.seconds_spent;
    }
  });

  /* Count backwards the number of days to show in the calendar */
  let days_to_show_in_calendar = clamp(
    parseInt(_.max(Object.keys(days_ago_to_seconds_spent))) + 4,
    MIN_DAYS_TO_SHOW,
    MAX_DAYS_TO_SHOW
  );
  /* Make sure the calendar shown starts on a Sunday */
  days_to_show_in_calendar += new Date(
    today_begins_at_timestamp - days_to_show_in_calendar * days
  ).getDay() /* getDay counts the number of days since Sunday */;

  let calendar_data = [];
  for (let days_ago = days_to_show_in_calendar; days_ago >= 0; days_ago--) {
    const seconds = days_ago_to_seconds_spent[days_ago] || 0;
    const minutes = seconds / 60;

    let opacity = 0;
    if (minutes) {
      opacity = mapZeroToInfinityToZeroToOne({
        input: minutes + 10,
        /* Spending 30 minutes fills eighty percent */
        goal_input: 30 + 10,
        goal_output: 0.8,
      });

      // 0.1; /* Minimum */
      // opacity += (0.8 * minutes) / 40; /* Portion of 40 minutes */
      // opacity +=
      //   (0.1 * Math.max(0, minutes - 40)) /
      //   (2 * 60); /* Portion of 40 minutes */
      //
      console.log({ minutes, opacity });
    }

    // const session_count = seconds / 60 / EACH_SESSION_LASTS_X_MINUTES;
    calendar_data.push({
      count: Math.ceil(seconds / 60),
      date: new Date(today_begins_at_timestamp - days_ago * days)
        .toISOString()
        .substring(0, 10),
      /* Level from 0 to 1 */
      level: Math.min(opacity, 1),
    });
  }

  let streak = 0;
  for (
    let days_ago = 0;
    days_ago === 0 || days_ago_to_seconds_spent[days_ago];
    days_ago++
  ) {
    streak++;
  }
  /* A one-day streak does not count */
  if (streak === 1) streak = 0;

  store.dispatch({
    type: "LOAD_OVERVIEW",
    content: {
      streak,
      seconds_spent_total,
      seconds_spent_this_week,
      calendar_data,
    },
  });
};

/* Get timestamp for the last 04:00 */
const DAY_STARTS_AT = 4; /* The day starts at 04:00 local time */
const get_today_begins_at_timestamp = () => {
  const now = new Date();

  let today_begins_at_timestamp = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    DAY_STARTS_AT,
    0,
    0
  ).getTime();
  /* Go back one day if it's past midnight for the user but not yet 04:00 */
  if (now.getTime() < today_begins_at_timestamp) {
    today_begins_at_timestamp -= day;
  }
  return today_begins_at_timestamp;
};
