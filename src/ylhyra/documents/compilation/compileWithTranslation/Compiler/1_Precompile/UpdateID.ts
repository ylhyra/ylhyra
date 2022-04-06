/*
  Keeps track of updated IDs.
  Is used to update the Audio Synchronization map.
*/

let updatedIds: { [key: string]: string } = {};
let previousIds: { [key: string]: string } = {};

export const updateId = (from: string, to: string) => {
  updatedIds[from] = to;
  previousIds[to] = from;
  return to;
};

// Recursive lookup
export const getUpdatedId = (id, depth = 0) => {
  if (updatedIds[id] && depth < 10) {
    return getUpdatedId(updatedIds[id], depth + 1);
  }
  return id;
};

export const getPreviousId = (id) => {
  return previousIds[id];
};

export const resetIds = () => {
  updatedIds = {};
};
