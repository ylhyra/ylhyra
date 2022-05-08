import { RowData } from "flashcards/flashcards/types/rowData";

export const shouldCreateFrontToBack = (row: RowData) => {
  if (row.direction === "BOTH") return true;
  if (row.direction === "ONLY_FRONT_TO_BACK") return true;
  if (row.direction === "ONLY_BACK_TO_FRONT") return false;

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
