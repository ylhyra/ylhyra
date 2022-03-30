"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (input) => {
    return input
        .toLowerCase()
        .replace(/[.,'-/"\\!]/g, "")
        .replace(/\s+/, " ")
        .trim();
};
