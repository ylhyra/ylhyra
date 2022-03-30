/*
  Keeps track of updated IDs.
  Is used to update the Audio Synchronization map.
*/

let updatedIDs = {};
let previousIDs = {};

export const updateID = (from, to) => {
  updatedIDs[from] = to;
  previousIDs[to] = from;
  return to;
};

// Recursive lookup
export const getUpdatedID = (id, depth = 0) => {
  if (updatedIDs[id] && depth < 10) {
    return getUpdatedID(updatedIDs[id], depth + 1);
  }
  return id;
};

export const getPreviousID = (id) => {
  return previousIDs[id];
};

export const resetIDs = () => {
  updatedIDs = {};
};
