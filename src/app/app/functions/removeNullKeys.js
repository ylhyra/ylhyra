"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (input) => {
    let out = {};
    Object.keys(input).forEach((key) => {
        if (input[key] === null || input[key] === undefined)
            return;
        out[key] = input[key];
    });
    return out;
};
