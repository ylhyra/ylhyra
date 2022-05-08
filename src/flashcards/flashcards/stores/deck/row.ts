import { RowData } from "flashcards/flashcards/types/rowData";
import { deckStore } from "flashcards/flashcards/stores/deck/deckStore";
import { computed, observable } from "mobx";

export class row {
  deck: deckStore;
  @observable data: RowData;

  constructor(deck: deckStore, data: RowData) {
    this.deck = deck;
    this.data = data;
  }

  toJSON() {
    return this.data;
  }

  @computed
  cards() {}
}
