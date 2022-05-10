import { RowId } from "flashcards/flashcards/actions/row/rowData.types";
import { CardIds } from "flashcards/flashcards/types";

/**
 * @deprecated
 */
export const getCardIdsShuffledIfSeen = (rowId: RowId): CardIds => {
  if (
    getCardIdsFromRowId(rowId).some((cardId) => cardId.isInSchedule()) &&
    Math.random() > 0.5
  ) {
    return getCardIdsFromRowId(rowId).reverse();
  } else {
    return getCardIdsFromRowId(rowId);
  }
};
