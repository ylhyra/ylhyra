"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyPrintDaysMinutesHours = exports.roundMsToMinute = exports.roundMsToHour = exports.daysFromNowToTimestamp = exports.msToS = exports.msToDays = exports.daysToMs = exports.clearTimeMemoized = exports.getTimeMemoized = exports.getTime = exports.minutes = exports.minute = exports.seconds = exports.second = exports.hours = exports.hour = exports.days = exports.day = void 0;
const math_1 = require("app/app/functions/math");
const simplePlural_1 = require("app/app/functions/simplePlural");
const msInHour = (1000 * 60 * 60);
const msInDay = (msInHour * 24);
exports.day = msInDay;
exports.days = exports.day;
exports.hour = msInHour;
exports.hours = exports.hour;
exports.second = 1000;
exports.seconds = exports.second;
exports.minute = (60 * exports.second);
exports.minutes = exports.minute;
const getTime = () => Date.now();
exports.getTime = getTime;
let timeMemoized;
const getTimeMemoized = () => {
    return timeMemoized || (timeMemoized = (0, exports.getTime)());
};
exports.getTimeMemoized = getTimeMemoized;
const clearTimeMemoized = () => (timeMemoized = null);
exports.clearTimeMemoized = clearTimeMemoized;
const daysToMs = (input) => (input * msInDay);
exports.daysToMs = daysToMs;
const msToDays = (input) => (input / msInDay);
exports.msToDays = msToDays;
const msToS = (input) => Math.round(input / 1000);
exports.msToS = msToS;
/**
 * @param {Days} input
 * @returns {Timestamp}
 */
const daysFromNowToTimestamp = (input) => (0, exports.getTime)() + (0, exports.daysToMs)(input);
exports.daysFromNowToTimestamp = daysFromNowToTimestamp;
/**
 * @param {Milliseconds} input
 * @returns {Milliseconds}
 */
const roundMsToHour = (input) => (0, math_1.roundToInterval)(input, msInHour);
exports.roundMsToHour = roundMsToHour;
/**
 * @param {Milliseconds} input
 * @returns {Milliseconds}
 */
const roundMsToMinute = (input) => (0, math_1.roundToInterval)(input, exports.minute);
exports.roundMsToMinute = roundMsToMinute;
/**
 * @param {Milliseconds} input
 * @returns {string}
 */
const prettyPrintDaysMinutesHours = (input) => {
    let out = [];
    const _days = input / exports.days;
    const _hours = (input - Math.floor(_days) * exports.days) / exports.hours;
    const _minutes = (_hours * exports.hours - Math.floor(_hours) * exports.hours) / exports.minutes;
    if (Math.floor(_days) > 0) {
        out.push((0, simplePlural_1.withPlural)(Math.floor(_days), "day"));
    }
    if (Math.floor(_hours) > 0) {
        out.push((0, simplePlural_1.withPlural)(Math.floor(_hours), "hour"));
    }
    if (Math.floor(_minutes) > 0) {
        out.push((0, simplePlural_1.withPlural)(Math.floor(_minutes), "minute"));
    }
    if (out.length === 0) {
        return "0 minutes";
    }
    return out.slice(0, 2).join(", ");
};
exports.prettyPrintDaysMinutesHours = prettyPrintDaysMinutesHours;
