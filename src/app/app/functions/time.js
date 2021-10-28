import { roundToInterval } from "app/app/functions/math";

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

/**
 * @returns {TimestampInMilliseconds}
 */
export const getTime = () => {
  return new Date().getTime();
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
  // TODO
  const _minutes = Math.ceil(input / minutes);
  return `${_minutes} minute${_minutes === 1 ? "" : "s"}`;
};
