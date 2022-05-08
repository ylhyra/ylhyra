import { RowData } from "flashcards/flashcards/types/rowData";
import { deckStore } from "flashcards/flashcards/stores/deck/deckStore";
import { computed, observable } from "mobx";
import { createCardId, createTermId } from "flashcards/flashcards/compile/ids";
import { CardIds, Direction, TermId } from "flashcards/flashcards/types/types";
import {
  shouldCreateBackToFront,
  shouldCreateFrontToBack,
} from "flashcards/flashcards/compile/functions";

export class rowStore {
  deck: deckStore;
  @observable data: RowData;

  constructor(deck: deckStore, data: RowData) {
    this.deck = deck;
    this.data = data;
  }

  toJSON() {
    return this.data;
  }

  @computed({ keepAlive: true })
  shouldCreate() {
    return this.data.front && this.data.back;
  }

  @computed({ keepAlive: true })
  compile() {}

  @computed({ keepAlive: true })
  getTermId(): TermId {
    return createTermId(this.deck.deckId, this.data.rowId);
  }

  @computed({ keepAlive: true })
  getCardIds(): CardIds | [] {
    if (!this.shouldCreate()) return [];
    let cardIds: CardIds = [];
    if (shouldCreateFrontToBack(this.data)) {
      cardIds.push(createCardId(this.getTermId(), Direction.FRONT_TO_BACK));
    }
    if (shouldCreateBackToFront(this.data)) {
      cardIds.push(createCardId(this.getTermId(), Direction.BACK_TO_FRONT));
    }
    return cardIds;
  }

  @computed({ keepAlive: true })
  getDependsOn() {}

  @computed({ keepAlive: true })
  getAlternativeIds() {}
}
