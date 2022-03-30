"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNonLetters = exports.removeDiacritics = void 0;
const diacritics_1 = require("diacritics");
/**
 * Icelandic-specific diacritic removal
 */
const removeDiacritics = (string) => {
    if (!string)
        return string;
    return (0, diacritics_1.remove)(string
        .replace(/Þ/g, "Th")
        .replace(/ð/g, "D")
        .replace(/ö/g, "O")
        .replace(/þ/g, "th")
        .replace(/ð/g, "d")
        .replace(/ö/g, "o"));
};
exports.removeDiacritics = removeDiacritics;
const removeNonLetters = (string) => {
    if (!string)
        return string;
    return string.replace(/[^\p{Script=Latin}]/giu, "");
};
exports.removeNonLetters = removeNonLetters;
