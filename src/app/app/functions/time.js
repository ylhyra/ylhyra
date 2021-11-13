import { roundToInterval } from "app/app/functions/math";
import { withPlural } from "app/app/functions/simplePlural";

/** @typedef {number} Milliseconds */
/** @typedef {number} Seconds */
/** @typedef {number} Minutes */
/** @typedef {number} Days */
/** @typedef {Milliseconds} TimestampInMilliseconds */

/** @type Milliseconds */
const msInHour = 1000 * 60 * 60;
/** @type Milliseconds */
const msInDay = msInHour * 24;
/** @type Milliseconds */
export const day = msInDay;
export const days = day;
/** @type Milliseconds */
export const hour = msInHour;
export const hours = hour;
/** @type Milliseconds */
export const second = 1000;
export const seconds = second;
/** @type Milliseconds */
export const minute = 60 * second;
export const minutes = minute;

// /* In seconds */
// export const minute_s = 60;
// /* In seconds */
// export const hour_s = 60 * minute_s;
// /* In seconds */
// export const day_s = 24 * hour_s;

/**
 * @returns {TimestampInMilliseconds}
 */
export const getTime = () => {
  return Date.now();
};

let timeMemoized;
/**
 * @returns {TimestampInMilliseconds}
 */
export const getTimeMemoized = () => {
  if (!timeMemoized) {
    timeMemoized = getTime();
  }
  return timeMemoized;
};
export const clearTimeMemoized = () => {
  timeMemoized = null;
};

/**
 * @param {Days} input
 * @returns {Milliseconds}
 */
export const daysToMs = (input) => input * msInDay;

/**
 * @param {Milliseconds} input
 * @returns {Days}
 */
export const msToDays = (input) => input / msInDay;

/**
 * @param {Milliseconds} input
 * @returns {Seconds}
 */
export const msToS = (input) => Math.round(input / 1000);

/**
 * @param {Days} input
 * @returns {Timestamp}
 */
export const inDays = (input) => getTime() + daysToMs(input);

/**
 * @param {Milliseconds} input
 * @returns {Milliseconds}
 */
export const roundMsToHour = (input) => roundToInterval(input, msInHour);

/**
 * @param {Milliseconds} input
 * @returns {Milliseconds}
 */
export const roundMsToMinute = (input) => roundToInterval(input, minute);

/**
 * @param {Milliseconds} input
 * @returns {string}
 */
export const prettyPrintDaysMinutesHours = (input) => {
  let out = [];

  const _days = input / days;
  const _hours = (input - Math.floor(_days) * days) / hours;
  const _minutes = (_hours * hours - Math.floor(_hours) * hours) / minutes;

  if (Math.floor(_days) > 0) {
    out.push(withPlural(Math.floor(_days), "day"));
  }
  if (Math.floor(_hours) > 0) {
    out.push(withPlural(Math.floor(_hours), "hour"));
  }
  if (Math.floor(_minutes) > 0) {
    out.push(withPlural(Math.floor(_minutes), "minute"));
  }

  if (out.length === 0) {
    return "0 minutes";
  }

  return out.slice(0, 2).join(", ");
};
