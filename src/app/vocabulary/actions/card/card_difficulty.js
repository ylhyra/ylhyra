"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBelowGood = exports.isFairlyBad = exports.isBad = exports.isTooEasy = void 0;
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const createSchedule_1 = require("app/vocabulary/actions/createSchedule");
const constants_1 = require("app/vocabulary/constants");
const isTooEasy = (id) => {
    return (0, card_schedule_1.getScore)(id) >= constants_1.EASY && (0, card_schedule_1.getSessionsSeen)(id) === 1;
};
exports.isTooEasy = isTooEasy;
const isBad = (id) => {
    return (0, card_schedule_1.getScore)(id) === constants_1.BAD;
};
exports.isBad = isBad;
const isFairlyBad = (id) => {
    return (0, card_schedule_1.getScore)(id) && (0, card_schedule_1.getScore)(id) <= constants_1.BAD + createSchedule_1.INCR;
};
exports.isFairlyBad = isFairlyBad;
const isBelowGood = (id) => {
    const j = (0, card_schedule_1.getScore)(id) || (0, card_schedule_1.getLowestAvailableTermScore)(id);
    return j && j < constants_1.GOOD;
};
exports.isBelowGood = isBelowGood;
