"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (input) => {
    if (!input)
        return input;
    return input
        .replace(/\u160/g, " ") // NBSP
        .replace(/\u8206/g, "") // LTR mark
        .replace(/\u00AD/g, ""); // Soft hyphen
};
