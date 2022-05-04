import { Direction } from "flashcards/flashcards/types/types";

/**
 * A CardId encodes both the rowId and the direction
 * Todo: Is this the best method?
 */
export const createCardId = (termId: TermId, direction: Direction): CardId => {
  return `${termId}-${direction}` as CardId;
};
