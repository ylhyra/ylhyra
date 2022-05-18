import { Card } from "flashcards/flashcards/actions/card/card";
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
import { getDefaultValue } from "modules/form";
import { removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues } from "modules/removeExtraWhitespace";
import { keys } from "modules/typescript/objectEntries";

export class Row {
  deck: Deck;
  data: RowData;

  constructor(deck: Deck, data: RowData) {
    this.deck = deck;
    this.data = data;
    makeObservable(this, {
      data: observable,
      // shouldCreateCards: computed({ keepAlive: true }),
      // cardIds: computed({ keepAlive: true }),
      cards: computed({ keepAlive: true }),
      dependsOn: computed({ keepAlive: true }),
      alternativeIds: computed({ keepAlive: true }),
    });
  }

  get rowId() {
    return this.data.rowId;
  }

  get cardIds(): CardIds | [] {
    if (!this.data.front || !this.data.back) return [];
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
   * Gets the row setting, falling back to the
   * deck setting, falling back to defaults.
   */
  getSetting<T extends keyof DeckSettings & keyof RowData>(
    key: T
  ): (DeckSettings & RowData)[T] {
    /* "!= null" tests for null and undefined */
    if (this.data[key] != null) {
      return this.data[key];
    }
    if (this.deck.settings[key] != null) {
      return this.deck.settings[key] as (DeckSettings & RowData)[T];
    }
    return (getDefaultValue(rowFields, key) ??
      getDefaultValue(deckSettingsFields, key)) as (DeckSettings & RowData)[T];
  }

  toJSON(): RowData {
    return removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues(
      this.data
    ) as RowData;
  }
}
