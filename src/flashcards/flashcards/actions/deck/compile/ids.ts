import { RowId } from "flashcards/flashcards/types/rowData";
import {
  CardId,
  DeckId,
  Direction,
  TermId,
} from "flashcards/flashcards/types/types";

/**
 * Can not be "-" due to shortId.generate() using it.
 */
export const CARD_ID_SEPARATOR = ":";

/**
 * A CardId encodes three parts:
 *    - The deckId
 *    - The rowId  (the two above parts together make up the termId)
 *    - The direction
 * This is done to make lookup easier.
 *
 * The output is thus:
 *    - "aaaaa:bbbbb:ccccc"
 */
export const createCardId = (termId: TermId, direction: Direction): CardId => {
  return `${termId}${CARD_ID_SEPARATOR}${direction}` as CardId;
};

/**
 * A termId is a combination of the deckId and the rowId.
 * @deprecated
 */
export const createTermId = (deckId: DeckId, rowId: RowId): TermId => {
  return `${deckId}${CARD_ID_SEPARATOR}${rowId}` as TermId;
};

export const getDeckId = (id: CardId | TermId): DeckId => {
  return id.split(CARD_ID_SEPARATOR)[0] as DeckId;
};

export const getRowId = (id: CardId | TermId): RowId => {
  return id.split(CARD_ID_SEPARATOR)[1] as RowId;
};

/**
 * TermId is encoded in CardId
 */
export const getTermIdFromCardId = (cardId: CardId) => {
  return cardId
    .split(CARD_ID_SEPARATOR)
    .slice(0, 2)
    .join(CARD_ID_SEPARATOR) as TermId;
};

/**
 * Direction is encoded in CardId
 */
export const getDirectionFromCardId = (cardId: CardId): Direction => {
  return cardId.split(CARD_ID_SEPARATOR)[2] as Direction;
};
