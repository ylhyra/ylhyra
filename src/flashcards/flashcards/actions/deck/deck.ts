import { computed, makeObservable, observable } from "mobx";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import { Card } from "flashcards/flashcards/actions/card/card";
import {
  addMultipleRows,
  addRow,
} from "flashcards/flashcards/actions/deck/_functions";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { getDependencyGraph } from "flashcards/flashcards/actions/dependencies/dependencyGraph";
import { Row } from "flashcards/flashcards/actions/row/row";
import { DeckId } from "flashcards/flashcards/types";
import { flattenArray } from "modules/arrays/flattenArray";

export class Deck {
  deckId: DeckId;
  rows: Row[] = [];
  settings: DeckSettings = {};
  constructor({
    deckId,
    rowsDataArray,
    settings,
  }: {
    deckId: DeckId;
    rowsDataArray?: RowData[];
    settings?: DeckSettings;
  }) {
    this.deckId = deckId;
    if (rowsDataArray) {
      this.rows = rowsDataArray.map((rowData) => {
        return new Row(this, rowData);
      });
    }
    this.settings = settings || {};
    makeObservable(this, {
      settings: observable,
      rows: observable,
      cards: computed({ keepAlive: true }),
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

  get dependencyGraph() {
    return getDependencyGraph.bind(this)();
  }

  addRow = addRow;
  addMultipleRows = addMultipleRows;

  toJSON() {
    return {
      deckId: this.deckId,
      settings: this.settings,
      rows: this.rows.map((row) => row.toJSON()),
    };
  }
}
