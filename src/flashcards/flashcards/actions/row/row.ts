import { Card } from "flashcards/flashcards/actions/card/card";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { deckSettingsFields } from "flashcards/flashcards/actions/deck/deckSettings.fields";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import {
  createCardId,
  createRowId,
} from "flashcards/flashcards/actions/row/ids";
import { rowFields } from "flashcards/flashcards/actions/row/rowData.fields";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import { CardIds, Direction } from "flashcards/flashcards/types";
import { computed, makeObservable, observable } from "mobx";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

export class Row {
  deck: Deck;
  @observable data: RowData;

  constructor(deck: Deck, data: RowData) {
    makeObservable(this, {
      data: observable,
      shouldCreate: computed({ keepAlive: true }),
      cardIds: computed({ keepAlive: true }),
      compile: computed({ keepAlive: true }),
      cards: computed({ keepAlive: true }),
      getDependsOn: computed({ keepAlive: true }),
      getAlternativeIds: computed({ keepAlive: true }),
    });

    this.deck = deck;
    this.data = data;
  }

  get rowId() {
    return this.data.rowId;
  }

  shouldCreate() {
    return this.data.front && this.data.back;
  }

  compile() {}

  get cardIds(): CardIds | [] {
    if (!this.shouldCreate()) return [];
    let cardIds: CardIds = [];
    const directionSetting = this.getSetting("direction");
    if (
      directionSetting === "BOTH" ||
      directionSetting === "ONLY_FRONT_TO_BACK"
    ) {
      cardIds.push(
        createCardId(
          createRowId(this.deck.deckId, this.data.rowId),
          Direction.FRONT_TO_BACK
        )
      );
    }
    if (
      directionSetting === "BOTH" ||
      directionSetting === "ONLY_BACK_TO_FRONT"
    ) {
      cardIds.push(
        createCardId(
          createRowId(this.deck.deckId, this.data.rowId),
          Direction.BACK_TO_FRONT
        )
      );
    }
    return cardIds;
  }

  get cards(): Card[] {
    const row = this;
    return this.cardIds.map((cardId) => new Card(row, cardId));
  }

  getDependsOn() {}

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

  toJSON() {
    return this.data;
  }
}
