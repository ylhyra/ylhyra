"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByArray = void 0;
const sortByArray = function (input, arrayToSortBy) {
    if (!arrayToSortBy) {
        console.error('Missing array in "sortByArray"');
        return input;
    }
    return input.sort((a, b) => {
        return arrayToSortBy.indexOf(a) - arrayToSortBy.indexOf(b);
    });
};
exports.sortByArray = sortByArray;
