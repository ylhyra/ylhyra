import { Card } from "flashcards/flashcards/actions/card/card";
import {
  CardId,
  DeckId,
  Direction,
  TermId,
} from "flashcards/flashcards/types/types";
import { RowId } from "flashcards/flashcards/types/rowData";

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

export function getDeckId(this: Card | TermId): DeckId {
  return id.split(CARD_ID_SEPARATOR)[0] as DeckId;
}

export function getRowId(this: Card | TermId): RowId {
  return id.split(CARD_ID_SEPARATOR)[1] as RowId;
}

/**
 * TermId is encoded in CardId
 */
export function getTermIdFromCardId(this: Card) {
  return cardId
    .split(CARD_ID_SEPARATOR)
    .slice(0, 2)
    .join(CARD_ID_SEPARATOR) as TermId;
}

/**
 * Direction is encoded in CardId
 */
export function getDirectionFromCardId(this: Card): Direction {
  return cardId.split(CARD_ID_SEPARATOR)[2] as Direction;
}
