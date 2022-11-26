import { Card, Cards } from "flashcards/flashcards/actions/card/card";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { deckSettingsFields } from "flashcards/flashcards/actions/deck/deckSettings.fields";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { createCardId } from "flashcards/flashcards/actions/row/ids";
import { rowFields } from "flashcards/flashcards/actions/row/rowData.fields";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import { CardIds, Direction } from "flashcards/flashcards/types";
import { computed, makeObservable, observable } from "mobx";
import { getDefaultValue } from "modules/form";
import { Dependencies } from "flashcards/flashcards/actions/dependencies/dependencies";

export class Row {
  constructor(public deck: Deck, public data: RowData) {
    deck.rows.set(this.rowId, this);
    makeObservable(this, {
      data: observable,
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
  get cards(): Cards {
    return new Cards(this.cardIds.map((cardId) => new Card(this, cardId)));
  }

  @computed({ keepAlive: true })
  get dependencies(): Dependencies {
    return new Dependencies(this);
  }

  /** Incoming redirects (strings that point to this row) */
  @computed({ keepAlive: true })
  get redirects(): string[] {
    // TODO: Incomplete, needs comma splitting
    return [this.data.front, this.data.alternativeId].filter(
      Boolean,
    ) as string[];
  }

  /**
   * Gets the row setting, falling back to the deck setting, falling back to
   * defaults.
   */
  getSetting<T extends keyof RowData>(key: T): RowData[T];
  getSetting<T extends keyof DeckSettings>(key: T): DeckSettings[T];
  getSetting<T extends keyof DeckSettings & keyof RowData>(
    key: T,
  ): (DeckSettings & RowData)[T] {
    if (this.data[key] != null) {
      return this.data[key];
    }
    if (this.deck.settings[key] != null) {
      return this.deck.settings[key] as (DeckSettings & RowData)[T];
    }
    return (getDefaultValue(rowFields, key) ??
      getDefaultValue(deckSettingsFields, key)) as (DeckSettings & RowData)[T];
  }
}
