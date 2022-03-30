"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ucfirst = void 0;
const ucfirst = (input) => {
    if (!input)
        return null;
    return input.charAt(0).toUpperCase() + input.slice(1);
};
exports.ucfirst = ucfirst;
