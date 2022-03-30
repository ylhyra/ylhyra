"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapZeroToInfinityToZeroToOne = exports.toFixedFloat = exports.roundMsTo100Sec = exports.roundMsToSec = exports.roundToInterval = exports.addSomeRandomness = exports.maxIgnoreUndef = exports.minIgnoreUndef = exports.maxIgnoreFalsy = exports.minIgnoreFalsy = exports.mapValueToRange = exports.clamp = exports.average = void 0;
const time_1 = require("app/app/functions/time");
const average = (arr = []) => {
    if (arr.length === 0)
        return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
};
exports.average = average;
const clamp = function (input, min, max) {
    return (0, exports.minIgnoreUndef)((0, exports.maxIgnoreUndef)(input, min), max);
};
exports.clamp = clamp;
const mapValueToRange = (_a) => {
    var { value, input_from, input_to, output_from, output_to } = _a, options = __rest(_a, ["value", "input_from", "input_to", "output_from", "output_to"]);
    const slope = (output_to - output_from) / (input_to - input_from);
    const output = output_from + slope * (value - input_from);
    if (options.clamp) {
        return (0, exports.clamp)(output, output_from, output_to);
    }
    return output;
};
exports.mapValueToRange = mapValueToRange;
const minIgnoreFalsy = (...values) => {
    return (0, exports.minIgnoreUndef)(...values.filter(Boolean));
};
exports.minIgnoreFalsy = minIgnoreFalsy;
const maxIgnoreFalsy = (...values) => {
    return (0, exports.maxIgnoreUndef)(...values.filter(Boolean));
};
exports.maxIgnoreFalsy = maxIgnoreFalsy;
const minIgnoreUndef = (...values) => {
    const j = Math.min(...values.filter((i) => i !== undefined && i !== null));
    return j !== Infinity ? j : null;
};
exports.minIgnoreUndef = minIgnoreUndef;
const maxIgnoreUndef = (...values) => {
    const j = Math.max(...values.filter((i) => i !== undefined && i !== null));
    return j !== -Infinity ? j : null;
};
exports.maxIgnoreUndef = maxIgnoreUndef;
/**
 * Randomly adds or subtracts up to 10% of the input
 */
const addSomeRandomness = (input, amount = 0.1) => {
    return input + input * amount * (Math.random() - 0.5) * 2;
};
exports.addSomeRandomness = addSomeRandomness;
const roundToInterval = (v, roundBy) => {
    return Math.round(v / roundBy) * roundBy;
};
exports.roundToInterval = roundToInterval;
const roundMsToSec = (v) => {
    return (0, exports.roundToInterval)(v, time_1.seconds);
};
exports.roundMsToSec = roundMsToSec;
const roundMsTo100Sec = (v) => {
    return (0, exports.roundToInterval)(v, 100 * time_1.seconds);
};
exports.roundMsTo100Sec = roundMsTo100Sec;
const toFixedFloat = (input, f) => {
    return parseFloat(input.toFixed(f));
};
exports.toFixedFloat = toFixedFloat;
/*
  A simple (x / (x + a)) curve, where a is small
 */
const mapZeroToInfinityToZeroToOne = ({ input, goal_input, goal_output, pow = 1.4, }) => {
    input = Math.pow(input, pow);
    goal_input = Math.pow(goal_input, pow);
    if (goal_output > 1)
        throw new Error();
    const a = (goal_input - goal_output * goal_input) / goal_output;
    return input / (input + a);
};
exports.mapZeroToInfinityToZeroToOne = mapZeroToInfinityToZeroToOne;
