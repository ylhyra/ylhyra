import { RowId } from "flashcards/flashcards/actions/row/rowData.types";
import { CardId, DeckId, Direction } from "flashcards/flashcards/types";

/** Can not be "-" due to shortId.generate() using it. */
export const CARD_ID_SEPARATOR = ":";

/**
 * A CardId encodes three parts:
 *
 * - The deckId
 * - The rowId
 * - The direction
 *
 * This is done to make lookup easier.
 *
 * The output is thus:
 *
 * - "aaaaa:bbbbb:ccccc"
 */
export function createCardId(
  deckId: DeckId,
  rowId: RowId,
  direction: Direction
): CardId {
  return `${deckId}${CARD_ID_SEPARATOR}${rowId}${CARD_ID_SEPARATOR}${direction}` as CardId;
}

// export function getDeckId(this: Card | RowId): DeckId {
//   return id.split(CARD_ID_SEPARATOR)[0] as DeckId;
// }
//
// export function getRowId(this: Card | RowId): RowId {
//   return id.split(CARD_ID_SEPARATOR)[1] as RowId;
// }

/**
 * Direction is encoded in CardId
 *
 * @deprecated
 */
export function getDirectionFromCardId(cardId: CardId): Direction {
  return cardId.split(CARD_ID_SEPARATOR)[2] as Direction;
}
