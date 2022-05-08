import { RowData } from "flashcards/flashcards/types/rowData";
import { rowStore } from "flashcards/flashcards/stores/deck/rowStore";

export const shouldCreateFrontToBack = (row: rowStore) => {
  if (row.getSetting("direction") === "BOTH") return true;
  if (row.getSetting("direction") === "ONLY_FRONT_TO_BACK") return true;
  if (row.getSetting("direction") === "ONLY_BACK_TO_FRONT") return false;

  /* TODO Derive from deck settings */
  return true;
};

export const shouldCreateBackToFront = (row: RowData) => {
  if (row.direction === "BOTH") return true;
  if (row.direction === "ONLY_FRONT_TO_BACK") return false;
  if (row.direction === "ONLY_BACK_TO_FRONT") return true;

  /* TODO Derive from deck settings */
  return true;
};
