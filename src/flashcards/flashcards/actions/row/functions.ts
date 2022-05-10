import { Row } from "flashcards/flashcards/actions/row/row";

export const shouldCreateFrontToBack = (row: Row) => {
  const setting = row.getSetting("direction");
  return setting === "BOTH" || setting === "ONLY_FRONT_TO_BACK";
};

export const shouldCreateBackToFront = (row: Row) => {
  const setting = row.getSetting("direction");
  return setting === "BOTH" || setting === "ONLY_BACK_TO_FRONT";
};
