import { CardId, Direction, TermId } from "flashcards/flashcards/types/types";
import { Row } from "flashcards/flashcards/types/row";

/**
 * Can not be "-" due to shortId.generate() using it.
 */
export const CARD_ID_PART_SEPARATOR = ":";

/**
 * A CardId encodes both the rowId and the direction
 * Todo: Is this the best method?
 *
 * Relied on by:
 * @see getDirection
 * @see getTermId
 */
export const createCardId = (termId: TermId, direction: Direction): CardId => {
  return `${termId}${CARD_ID_PART_SEPARATOR}${direction}` as CardId;
};

export const shouldCreateFrontToBack = (row: Row) => {
  if (row.direction === "BOTH") return true;
  if (row.direction === "ONLY_FRONT_TO_BACK") return true;
  if (row.direction === "ONLY_BACK_TO_FRONT") return false;

  /* TODO Derive from deck settings */
  return true;
};

export const shouldCreateBackToFront = (row: Row) => {
  if (row.direction === "BOTH") return true;
  if (row.direction === "ONLY_FRONT_TO_BACK") return false;
  if (row.direction === "ONLY_BACK_TO_FRONT") return true;

  /* TODO Derive from deck settings */
  return true;
};
