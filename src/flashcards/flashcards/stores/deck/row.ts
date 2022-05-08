import { DeckId } from "flashcards/flashcards/types/types";
import { Row } from "flashcards/flashcards/types/row";
import { observable } from "mobx";

export class row {
  deckId: DeckId;
  @observable data: Row;

  constructor({ deckId, values }: { deckId: DeckId; values: Row }) {
    this.deckId = deckId;
    this.data = values;
    // makeAutoObservable(this);
  }

  toJSON() {
    return this.data;
  }
}
