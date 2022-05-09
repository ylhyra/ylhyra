import { RowData } from "flashcards/flashcards/types/rowData";
import { deckStore } from "flashcards/flashcards/stores/deck/deckStore";
import { computed, observable } from "mobx";
import {
  createCardId,
  createTermId,
} from "flashcards/flashcards/stores/deck/compile/ids";
import { CardIds, Direction, TermId } from "flashcards/flashcards/types/types";
import {
  shouldCreateBackToFront,
  shouldCreateFrontToBack,
} from "flashcards/flashcards/stores/deck/compile/functions";
import { DeckSettings } from "flashcards/flashcards/types/deckSettings";
import { deckSettingsFields } from "flashcards/flashcards/make/deckSettings";
import { rowFields } from "flashcards/flashcards/make/rowFields";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

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
    if (shouldCreateFrontToBack(this)) {
      cardIds.push(createCardId(this.getTermId(), Direction.FRONT_TO_BACK));
    }
    if (shouldCreateBackToFront(this)) {
      cardIds.push(createCardId(this.getTermId(), Direction.BACK_TO_FRONT));
    }
    return cardIds;
  }

  @computed({ keepAlive: true })
  getDependsOn() {}

  @computed({ keepAlive: true })
  getAlternativeIds() {}

  /**
   * Gets the row setting, falling back to the deck setting, falling back to defaults.
   */
  getSetting<T extends keyof DeckSettings & keyof RowData>(
    key: T
  ): (DeckSettings & RowData)[T] {
    return warnIfFunctionIsSlow(() => {
      /* "!= null" tests for null and undefined */
      if (this.data[key] != null) {
        return this.data[key];
      }
      if (this.deck.settings[key] != null) {
        return this.deck.settings[key];
      }
      return (
        rowFields.find((field) => field.name === key)?.defaultValue ??
        deckSettingsFields.find((field) => field.name === key)?.defaultValue
      );
    }) as (DeckSettings & RowData)[T];
  }
}
