"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPlural = void 0;
/* Simple "-s" plurals */
const withPlural = (value, singular) => {
    return `${value || 0} ${singular}${value === 1 || value === true ? "" : "s"}`;
};
exports.withPlural = withPlural;
