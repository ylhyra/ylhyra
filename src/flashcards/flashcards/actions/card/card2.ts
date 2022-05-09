import { Row } from "flashcards/flashcards/actions/row/row";
import { CardId } from "flashcards/flashcards/types/types";

export class Card {
  row: Row;
  cardId: CardId;

  constructor(row: Row, cardId: CardId) {
    this.row = row;
    this.cardId = cardId;
  }
}
