"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeExtraWhitespace = void 0;
const removeExtraWhitespace = (input) => {
    if (!input)
        return "";
    return input.replace(/[\s]+/g, " ").trim();
};
exports.removeExtraWhitespace = removeExtraWhitespace;
