"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleLocally = void 0;
const isDev_1 = require("app/app/functions/isDev");
const underscore_1 = require("underscore");
/**
 * Shuffles an array just a little bit, while keeping items in their locality.
 * @param array
 * @param range - Split array into groups of this size, and then shuffle within these groups.
 * @returns array
 */
const shuffleLocally = (array, range = 10) => {
    if (isDev_1.isDev)
        return array;
    let out = [];
    for (let i = 0; i < array.length; i += range) {
        out = out.concat((0, underscore_1.shuffle)(array.slice(i, i + range)));
    }
    return out;
};
exports.shuffleLocally = shuffleLocally;
