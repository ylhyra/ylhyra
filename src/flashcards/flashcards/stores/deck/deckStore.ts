import { CardIds, DeckId, RowsObject } from "flashcards/flashcards/types/types";
import { DeckSettings } from "flashcards/flashcards/types/deckSettings";
import { RowId } from "flashcards/flashcards/types/rowData";
import { computed, makeAutoObservable } from "mobx";
import { entries, values } from "modules/typescript/objectEntries";
import { getDependencyGraph } from "flashcards/flashcards/compile/dependencies/dependencyGraph";
import { rowStore } from "flashcards/flashcards/stores/deck/rowStore";
import { flattenArray } from "modules/arrays/flattenArray";

export class deckStore {
  deckId: DeckId;
  rows: Record<RowId, rowStore>;
  settings: DeckSettings;

  constructor({
    deckId,
    rows,
    settings,
  }: {
    deckId: DeckId;
    rows?: RowsObject;
    settings?: DeckSettings;
  }) {
    this.deckId = deckId;
    this.rows = {};
    entries(rows || {}).forEach(([rowId, rowData]) => {
      this.rows[rowId] = new rowStore(this, rowData);
    });
    this.settings = settings || {};
    console.log(this.rows);
    makeAutoObservable(this);
  }

  @computed({ keepAlive: true })
  getCardIds(): CardIds {
    return flattenArray(
      values(this.rows).map((row) => row.getCardIds())
    ) as CardIds;
  }

  @computed({ keepAlive: true })
  getDependencyGraph = getDependencyGraph;
}
