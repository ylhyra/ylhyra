import { Chapter } from "flashcards/flashcards/actions/chapter/chapter";
import { DeckId } from "flashcards/flashcards/types";
import { computed, makeObservable, observable } from "mobx";
import { Card } from "flashcards/flashcards/actions/card/card";
import {
  DeckData,
  deckDataFields,
} from "flashcards/flashcards/actions/deck/deckData";
import { Row } from "flashcards/flashcards/actions/row/row";
import { RowId } from "flashcards/flashcards/actions/row/rowData";
import { flattenArray } from "modules/arrays/flattenArray";
import { store } from "../../../store";
import { getDefaultValue } from "modules/form";

export class Deck {
  @observable rows: Map<RowId, Row> = new Map();
  @observable chapters: Chapter[] = [];

  constructor(public deckId: DeckId, public settings: DeckData) {
    store.decks.set(deckId, this);
    makeObservable(this);
  }

  get title() {
    return this.settings.title || "(untitled)";
  }

  @computed({ keepAlive: true })
  get cards(): Card[] {
    return flattenArray([...this.rows.values()].map((row) => row.cards)).filter(
      (card) => !card.isIgnored,
    );
  }

  /* TODO!!! Support multiple redirects */
  get redirectsToRow(): Record<string, Row> {
    let out: Record<string, Row> = {};
    for (let row of this.rows.values()) {
      row.redirects.forEach((alternativeId) => {
        out[alternativeId] = row;
      });
    }
    return out;
  }

  /** Used when editing rows */
  /** @deprecated */
  get rowsAsArray(): Row[] {
    console.log("rowsAsArray called");
    return [...this.rows.values()].sort(
      (a, b) => a.data.rowNumber - b.data.rowNumber,
    );
  }

  getSetting<T extends keyof DeckData>(key: T): DeckData[T] {
    if (this.settings[key] != null) {
      return this.settings[key];
    }
    return getDefaultValue(deckDataFields, key);
  }
}
