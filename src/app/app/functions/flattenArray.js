"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flattenArray = (data) => {
    var r = [];
    data.forEach((e) => Array.isArray(e) ? (r = r.concat(flattenArray(e))) : r.push(e));
    return r;
};
exports.default = flattenArray;
