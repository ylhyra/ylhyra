import {Card} from "flashcards/flashcards/actions/card/card";
import {RowId} from "flashcards/flashcards/actions/row/rowData.types";
import {CardId, DeckId, Direction} from "flashcards/flashcards/types";

/**
 * Can not be "-" due to shortId.generate() using it.
 */
export const CARD_ID_SEPARATOR = ":";

/**
 * A CardId encodes three parts:
 *    - The deckId
 *    - The rowId  (the two above parts together make up the rowId)
 *    - The direction
 * This is done to make lookup easier.
 *
 * The output is thus:
 *    - "aaaaa:bbbbb:ccccc"
 */
export const createCardId = (rowId: RowId, direction: Direction): CardId => {
  return `${rowId}${CARD_ID_SEPARATOR}${direction}` as CardId;
};

/**
 * A rowId is a combination of the deckId and the rowId.
 * @deprecated
 */
export const createRowId = (deckId: DeckId, rowId: RowId): RowId => {
  return `${deckId}${CARD_ID_SEPARATOR}${rowId}` as RowId;
};

export function getDeckId(this: Card | RowId): DeckId {
  return id.split(CARD_ID_SEPARATOR)[0] as DeckId;
}

export function getRowId(this: Card | RowId): RowId {
  return id.split(CARD_ID_SEPARATOR)[1] as RowId;
}

/**
 * RowId is encoded in CardId
 */
export function this: Card.row.rowId {
  return cardId
    .split(CARD_ID_SEPARATOR)
    .slice(0, 2)
    .join(CARD_ID_SEPARATOR) as RowId;
}

/**
 * Direction is encoded in CardId
 */
export function getDirection(this: Card): Direction {
  return this.cardId.split(CARD_ID_SEPARATOR)[2] as Direction;
}
