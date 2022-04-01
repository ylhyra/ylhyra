import axios from "ylhyra/app/app/axios";
import { log } from "modules/log";
import {
  clamp,
  mapValueToRange,
  mapZeroToInfinityToZeroToOne,
} from "ylhyra/app/app/functions/math";
import { day, days } from "modules/time";
import store from "ylhyra/app/app/store";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import { PercentageKnownOverall } from "ylhyra/app/vocabulary/actions/functions/percentageKnown";
import { sync } from "ylhyra/app/vocabulary/actions/userData/sync";
import {
  getUserData,
  setUserData,
} from "ylhyra/app/vocabulary/actions/userData/userData";
import {
  getSessions,
  SESSION_PREFIX,
} from "ylhyra/app/vocabulary/actions/userData/userDataSessions";
import _ from "underscore";

const MIN_DAYS_TO_SHOW = 2.5 * 30;
const MAX_DAYS_TO_SHOW = 365;

export const clearOverview = async () => {
  store.dispatch({
    type: "LOAD_OVERVIEW",
    content: {
      loaded: false,
    },
  });
};

export const calculateOverview = async () => {
  if (!deck) return null;

  await session_log_migration();

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
    if (days_ago <= 6) {
      seconds_spent_this_week += session.seconds_spent;
    }
  });

  /* Count backwards the number of days to show in the calendar */
  let days_to_show_in_calendar = clamp(
    _.max(Object.keys(days_ago_to_seconds_spent).map((i) => parseInt(i))) + 7,
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
      opacity = mapValueToRange({
        value: mapZeroToInfinityToZeroToOne({
          input: minutes,
          /* Spending 40 minutes fills eighty percent */
          goal_input: 40,
          goal_output: 0.8,
        }),
        input_from: 0,
        input_to: 1,
        output_from: 0.2,
        output_to: 1,
      });
    }

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
    if (days_ago_to_seconds_spent[days_ago]) {
      streak++;
    }
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
      percentage_known_overall: PercentageKnownOverall(),
      loaded: true,
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

export const SESSION_LOG_MIGRATION_FINISHED__KEY = "session_log_migr";
export const session_log_migration = async () => {
  if (getUserData(SESSION_LOG_MIGRATION_FINISHED__KEY)) {
    log("Session log already migrated");
    return;
  }
  if (Object.keys(deck.schedule).length > 0) {
    const data = (await axios.get("/api/vocabulary/session_log_migration"))
      .data;
    if (!data || !Array.isArray(data) || data.length === 0) return;

    data.forEach((session) => {
      const id = SESSION_PREFIX + session.timestamp / 1000;
      if (getUserData(id)) return;
      setUserData(
        id,
        {
          seconds_spent: session.seconds_spent,
          timestamp: session.timestamp,
        },
        "session"
      );
    });
  }
  setUserData(SESSION_LOG_MIGRATION_FINISHED__KEY, true);
  sync();
  // console.log(data);
};
