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

export class Row {
  constructor(public deck: Deck, public data: RowData) {
    // Todo: Generalize
    deck.rows.set(this.rowId, this);
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
  getSetting<T extends keyof DeckData>(key: T): DeckData[T];
  getSetting<T extends keyof DeckData & keyof RowData>(
    key: T,
  ): (DeckData & RowData)[T] {
    if (this.data[key] != null) {
      return this.data[key];
    }
    if (this.deck.settings[key] != null) {
      return this.deck.settings[key] as (DeckData & RowData)[T];
    }
    return (getDefaultValue(rowFields, key) ??
      getDefaultValue(deckDataFields, key)) as (DeckData & RowData)[T];
  }
}
