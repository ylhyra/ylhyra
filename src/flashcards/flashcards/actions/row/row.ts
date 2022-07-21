import { Card } from "flashcards/flashcards/actions/card/card";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { deckSettingsFields } from "flashcards/flashcards/actions/deck/deckSettings.fields";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { createCardId } from "flashcards/flashcards/actions/row/ids";
import { rowFields } from "flashcards/flashcards/actions/row/rowData.fields";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import {
  CardIds,
  DependenciesForOneRowAsDependencyToDepth,
  Direction,
} from "flashcards/flashcards/types";
import { makeSynced } from "flashcards/userData/userDataStore";
import { computed, makeObservable, observable } from "mobx";
import { getDefaultValue } from "modules/form";
import { removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues } from "modules/removeExtraWhitespace";

export class Row {
  @observable data: RowData;

  constructor(public deck: Deck, data: RowData) {
    // this.data = syncedValue({ type: "row", key: data.rowId, value: data });
    this.data = data;
    makeSynced(this);
    makeObservable(this);
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
        createCardId(
          this.deck.deckId,
          this.data.rowId,
          Direction.FRONT_TO_BACK,
        ),
      );
    }
    if (
      directionSetting === "BOTH" ||
      directionSetting === "ONLY_BACK_TO_FRONT"
    ) {
      cardIds.push(
        createCardId(
          this.deck.deckId,
          this.data.rowId,
          Direction.BACK_TO_FRONT,
        ),
      );
    }
    return cardIds;
  }

  @computed({ keepAlive: true })
  get cards(): Card[] {
    const row = this;
    return this.cardIds.map((cardId) => new Card(row, cardId));
  }

  @computed({ keepAlive: true })
  get dependsOn(): string[] {
    // TODO: Incomplete, needs comma splitting
    return [this.data.dependsOn].filter(Boolean) as string[];
  }

  get dependencies(): DependenciesForOneRowAsDependencyToDepth {
    return this.deck.dependencyGraph[this.rowId] || {};
  }

  // getDependenciesAsArrayOfRowIds(): RowIds {
  //   return keys(this.dependencies);
  // }

  /** Incoming redirects (strings that point to this row) */
  @computed({ keepAlive: true })
  get redirects(): string[] {
    // TODO: Incomplete, needs comma splitting
    return [this.data.front, this.data.alternativeId].filter(
      Boolean,
    ) as string[];
  }

  /**
   * Gets the row setting, falling back to the
   * deck setting, falling back to defaults.
   */
  getSetting<T extends keyof DeckSettings & keyof RowData>(
    key: T,
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
      this.data,
    ) as RowData;
  }
}
