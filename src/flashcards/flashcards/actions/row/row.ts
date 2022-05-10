import { Card } from "flashcards/flashcards/actions/card/card";
import { removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues } from "flashcards/flashcards/actions/deck/_functions";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { deckSettingsFields } from "flashcards/flashcards/actions/deck/deckSettings.fields";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { createCardId } from "flashcards/flashcards/actions/row/ids";
import { rowFields } from "flashcards/flashcards/actions/row/rowData.fields";
import {
  RowData,
  RowIds,
} from "flashcards/flashcards/actions/row/rowData.types";
import {
  CardIds,
  DependenciesForOneRowAsDependencyToDepth,
  Direction,
} from "flashcards/flashcards/types";
import { computed, makeObservable, observable } from "mobx";
import { keys } from "modules/typescript/objectEntries";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

export class Row {
  deck: Deck;
  @observable data: RowData;

  constructor(deck: Deck, data: RowData) {
    makeObservable(this, {
      data: observable,
      shouldCreateCards: computed({ keepAlive: true }),
      cardIds: computed({ keepAlive: true }),
      cards: computed({ keepAlive: true }),
      dependsOn: computed({ keepAlive: true }),
      alternativeIds: computed({ keepAlive: true }),
    });

    this.deck = deck;
    this.data = data;
  }

  get rowId() {
    return this.data.rowId;
  }

  get shouldCreateCards() {
    return this.data.front && this.data.back;
  }

  get cardIds(): CardIds | [] {
    if (!this.shouldCreateCards) return [];
    let cardIds: CardIds = [];
    const directionSetting = this.getSetting("direction");
    if (
      directionSetting === "BOTH" ||
      directionSetting === "ONLY_FRONT_TO_BACK"
    ) {
      cardIds.push(
        createCardId(this.deck.deckId, this.data.rowId, Direction.FRONT_TO_BACK)
      );
    }
    if (
      directionSetting === "BOTH" ||
      directionSetting === "ONLY_BACK_TO_FRONT"
    ) {
      cardIds.push(
        createCardId(this.deck.deckId, this.data.rowId, Direction.BACK_TO_FRONT)
      );
    }
    return cardIds;
  }

  get cards(): Card[] {
    const row = this;
    return this.cardIds.map((cardId) => new Card(row, cardId));
  }

  get dependsOn() {
    throw new Error("Not implemented");
  }

  get dependencies(): DependenciesForOneRowAsDependencyToDepth {
    return this.deck.dependencyGraph[this.rowId];
  }

  getDependenciesAsArrayOfRowIds(): RowIds {
    return keys(this.deck.dependencyGraph[this.rowId]);
  }

  get alternativeIds() {
    throw new Error("Not implemented");
  }

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
    return removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues(
      this.data
    );
  }
}
