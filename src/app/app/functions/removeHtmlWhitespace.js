"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeHtmlWhitespace = void 0;
const block = "(?:div|table|tbody|td|tr|th|ul)";
const removeHtmlWhitespace = (input) => {
    return input
        .replace(/([\s\n]+)/g, " ")
        .replace(new RegExp(`(<${block}( [^>]+)?>) `, "gi"), "$1")
        .replace(new RegExp(` (</${block})`, "gi"), "$1");
};
exports.removeHtmlWhitespace = removeHtmlWhitespace;
