import { Card, Cards } from "flashcards/flashcards/actions/card/card";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import {
  DeckData,
  deckDataFields,
} from "flashcards/flashcards/actions/deck/deckData";
import { createCardId } from "flashcards/flashcards/actions/row/ids";
import { RowData, rowFields } from "flashcards/flashcards/actions/row/rowData";
import { CardIds, Direction } from "flashcards/flashcards/types";
import { computed, makeObservable } from "mobx";
import { getDefaultValue } from "modules/form";
import { Dependencies } from "flashcards/flashcards/actions/dependencies/dependencies";
import { SyncedData } from "flashcards/userData/userDataValue";

export class Row extends RowData {
  constructor(public deck: Deck, data: Omit<RowData, keyof SyncedData>) {
    super(data);
    // // Todo: Generalize
    // deck.rows.set(this.rowId, this);
    makeObservable(this);
  }

  get cardIds(): CardIds | [] {
    if (!this.front || !this.back) return [];
    let cardIds: CardIds = [];
    const directionSetting = this.getSetting("direction");
    if (
      directionSetting === "BOTH" ||
      directionSetting === "ONLY_FRONT_TO_BACK"
    ) {
      cardIds.push(
        createCardId(this.deck.deckId, this.rowId, Direction.FRONT_TO_BACK),
      );
    }
    if (
      directionSetting === "BOTH" ||
      directionSetting === "ONLY_BACK_TO_FRONT"
    ) {
      cardIds.push(
        createCardId(this.deck.deckId, this.rowId, Direction.BACK_TO_FRONT),
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
    return [this.front, this.alternativeId].filter(Boolean) as string[];
  }

  /**
   * Gets the row setting, falling back to the deck setting, falling back to
   * defaults.
   */
  getSetting<T extends keyof RowData>(key: T): RowData[T];
  getSetting<T extends keyof DeckData>(key: T): DeckData[T];
  getSetting<T extends keyof DeckData & keyof RowData>(
    key: T,
  ): (DeckData & RowData)[T] {
    if (this[key] != null) {
      return this[key];
    }
    if (this.deck.settings[key] != null) {
      return this.deck.settings[key] as (DeckData & RowData)[T];
    }
    return (getDefaultValue(rowFields, key) ??
      getDefaultValue(deckDataFields, key)) as (DeckData & RowData)[T];
  }
}
