import { Card } from "flashcards/flashcards/actions/card/card";
import {
  addMultipleRows,
  addRow,
} from "flashcards/flashcards/actions/deck/_functions";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { getDependencyGraph } from "flashcards/flashcards/actions/dependencies/dependencyGraph";
import { Row } from "flashcards/flashcards/actions/row/row";
import {
  RowData,
  RowId,
} from "flashcards/flashcards/actions/row/rowData.types";
import { DeckId } from "flashcards/flashcards/types";
import { computed, makeObservable, observable } from "mobx";
import { applyFunctionToEachObjectValue } from "modules/applyFunctionToEachObjectValue";
import { flattenArray } from "modules/arrays/flattenArray";
import { entries, values } from "modules/typescript/objectEntries";

export class Deck {
  deckId: DeckId;
  rows: Record<RowId, Row>;
  rowsArray: Row[];
  settings: DeckSettings;

  constructor({
    deckId,
    rows,
    settings,
  }: {
    deckId: DeckId;
    rows?: Record<RowId, RowData>;
    settings?: DeckSettings;
  }) {
    this.deckId = deckId;
    this.rows = {};
    this.rowsArray = [];
    entries(rows || {}).forEach(([rowId, rowData]) => {
      this.rows[rowId] = new Row(this, rowData);
    });
    this.settings = settings || {};
    makeObservable(this, {
      settings: observable.deep,
      // rows: observable.shallow,
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
    return flattenArray(values(this.rows).map((row) => row.cards));
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
      rows: applyFunctionToEachObjectValue(this.rows, (row) => row.toJSON()),
    };
  }
}
