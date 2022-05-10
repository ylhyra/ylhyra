import { Card } from "flashcards/flashcards/actions/card/card";
import { getDependencyGraph } from "flashcards/flashcards/actions/deck/compile/dependencies/dependencyGraph";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { Row } from "flashcards/flashcards/actions/row/row";
import {
  RowData,
  RowId,
} from "flashcards/flashcards/actions/row/rowData.types";
import { CardIds, DeckId } from "flashcards/flashcards/types";
import { computed, makeAutoObservable } from "mobx";
import { flattenArray } from "modules/arrays/flattenArray";
import { entries, values } from "modules/typescript/objectEntries";

export class Deck {
  deckId: DeckId;
  rows: Record<RowId, Row>;
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
    entries(rows || {}).forEach(([rowId, rowData]) => {
      this.rows[rowId] = new Row(this, rowData);
    });
    this.settings = settings || {};
    makeAutoObservable(this);
  }

  /** @deprecated */
  getCardIds(): CardIds {
    return flattenArray(
      values(this.rows).map((row) => row.getCardIds())
    ) as CardIds;
  }

  @computed({ keepAlive: true })
  getCards(): Card[] {
    return flattenArray(
      values(this.rows).map((row) => row.getCards())
    ) as Card[];
  }

  @computed({ keepAlive: true })
  getDependencyGraph = getDependencyGraph;
}
