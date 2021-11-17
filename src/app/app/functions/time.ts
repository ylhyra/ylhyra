import { roundToInterval } from "app/app/functions/math";
import { withPlural } from "app/app/functions/simplePlural";
import { Brand } from "ts-brand";

// export type Milliseconds = number & { Milliseconds: "Milliseconds" };
export type Milliseconds = number; //Brand<number, "Milliseconds">;
export type Seconds = number; //Brand<number, "Seconds">;
export type Days = number; //Brand<number, "Days">;
export type Timestamp = number; //Brand<number, "Timestamp">;

const msInHour = (1000 * 60 * 60) as Milliseconds;
const msInDay = (msInHour * 24) as Milliseconds;
export const day = msInDay as Milliseconds;
export const days = day;
export const hour = msInHour as Milliseconds;
export const hours = hour;
export const second = 1000 as Milliseconds;
export const seconds = second;
export const minute = (60 * second) as Milliseconds;
export const minutes = minute;

export const getTime = (): Timestamp => Date.now() as Timestamp;

let timeMemoized: Timestamp;
export const getTimeMemoized = (): Timestamp => {
  return timeMemoized || (timeMemoized = getTime());
};
export const clearTimeMemoized = () => (timeMemoized = null);

export const daysToMs = (input: Days): Milliseconds =>
  (input * msInDay) as Milliseconds;

export const msToDays = (input: Milliseconds): Days =>
  (input / msInDay) as Days;

export const msToS = (input: Milliseconds): Seconds =>
  Math.round(input / 1000) as Seconds;

/**
 * @param {Days} input
 * @returns {Timestamp}
 */
export const daysFromNowToTimestamp = (input) => getTime() + daysToMs(input);

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