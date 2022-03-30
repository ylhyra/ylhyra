"use strict";
/*
  Keeps track of updated IDs.
  Is used to update the Audio Synchronization map.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetIDs = exports.getPreviousID = exports.getUpdatedID = exports.updateID = void 0;
let updatedIDs = {};
let previousIDs = {};
const updateID = (from, to) => {
    updatedIDs[from] = to;
    previousIDs[to] = from;
    return to;
};
exports.updateID = updateID;
// Recursive lookup
const getUpdatedID = (id, depth = 0) => {
    if (updatedIDs[id] && depth < 10) {
        return (0, exports.getUpdatedID)(updatedIDs[id], depth + 1);
    }
    return id;
};
exports.getUpdatedID = getUpdatedID;
const getPreviousID = (id) => {
    return previousIDs[id];
};
exports.getPreviousID = getPreviousID;
const resetIDs = () => {
    updatedIDs = {};
};
exports.resetIDs = resetIDs;
