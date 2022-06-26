import { Card } from "flashcards/flashcards/actions/card/card";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { getDependencyGraph } from "flashcards/flashcards/actions/dependencies/dependencyGraph";
import { Row } from "flashcards/flashcards/actions/row/row";
import {
  RowData,
  RowId,
} from "flashcards/flashcards/actions/row/rowData.types";
import { DeckId } from "flashcards/flashcards/types";
import { computed, makeObservable, observable } from "mobx";
import { flattenArray } from "modules/arrays/flattenArray";

export class Deck {
  deckId: DeckId;
  rows: Row[] = [];
  settings: DeckSettings = {};
  constructor({
    deckId,
    rows,
    settings,
  }: {
    deckId: DeckId;
    rows?: RowData[];
    settings?: DeckSettings;
  }) {
    this.deckId = deckId;
    if (rows) {
      this.rows = rows.map((rowData) => {
        return new Row(this, rowData);
      });
    }
    this.settings = settings || {};
    makeObservable(this, {
      settings: observable,
      rows: observable,
      cards: computed({ keepAlive: true }),
      alternativeIds: computed({ keepAlive: true }),
      dependencyGraph: computed({ keepAlive: true }),
    });
  }

  get title() {
    return this.settings.title || "(untitled)";
  }

  // get cardIds(): CardIds {
  //   return flattenArray(values(this.rows).map((row) => row.cards)) as CardIds;
  // }

  get cards(): Card[] {
    return flattenArray(this.rows.map((row) => row.cards));
  }

  get alternativeIds(): Record<RowId, RowId> {
    let out: Record<RowId, RowId> = {};
    this.rows.forEach((row) => {
      row.redirects.forEach((alternativeId) => {
        out[alternativeId] = row.rowId;
      });
    });
    return out;
  }

  get dependencyGraph() {
    return getDependencyGraph.bind(this)();
  }

  toJSON() {
    return {
      deckId: this.deckId,
      settings: this.settings,
      rows: this.rows.map((row) => row.toJSON()),
    };
  }
}
