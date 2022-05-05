import { CardId, Direction, TermId } from "flashcards/flashcards/types/types";

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
