import {
  CardId,
  DeckId,
  Direction,
  TermId,
} from "flashcards/flashcards/types/types";
import { RowId } from "flashcards/flashcards/types/row";

/**
 * Can not be "-" due to shortId.generate() using it.
 */
export const ID_SEPARATOR_BETWEEN_DECK_ID_AND_ROW_ID = ":";
export const ID_SEPARATOR_BETWEEN_ROW_ID_AND_DIRECTION = ">";

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
  return `${termId}${ID_SEPARATOR_BETWEEN_ROW_ID_AND_DIRECTION}${direction}` as CardId;
};

/**
 * A termId is a combination of the deckId and the rowId.
 */
export const createTermId = (deckId: DeckId, rowId: RowId): TermId => {
  return `${deckId}${ID_SEPARATOR_BETWEEN_DECK_ID_AND_ROW_ID}${rowId}` as TermId;
};

export const getDeckIdFromTermIdOrCardId = (id: CardId | TermId): DeckId => {
  return id.split(ID_SEPARATOR_BETWEEN_DECK_ID_AND_ROW_ID)[0] as DeckId;
};

/**
 * TermId is encoded in CardId
 */
export const getTermIdFromCardId = (cardId: CardId) => {
  return cardId.split(ID_SEPARATOR_BETWEEN_ROW_ID_AND_DIRECTION)[0] as TermId;
};

/**
 * Direction is encoded in CardId
 */
export const getDirectionFromCardId = (cardId: CardId): Direction => {
  return cardId.split(
    ID_SEPARATOR_BETWEEN_ROW_ID_AND_DIRECTION
  )[1] as Direction;
};
