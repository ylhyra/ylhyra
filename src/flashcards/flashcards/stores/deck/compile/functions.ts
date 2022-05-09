import { rowStore } from "flashcards/flashcards/stores/deck/rowStore";

export const shouldCreateFrontToBack = (row: rowStore) => {
  const setting = row.getSetting("direction");
  return setting === "BOTH" || setting === "ONLY_FRONT_TO_BACK";
};

export const shouldCreateBackToFront = (row: rowStore) => {
  const setting = row.getSetting("direction");
  return setting === "BOTH" || setting === "ONLY_BACK_TO_FRONT";
};
