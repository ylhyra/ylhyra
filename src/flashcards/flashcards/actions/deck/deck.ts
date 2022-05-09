import {Card} from "flashcards/flashcards/actions/card/card2";
import { CardId, CardIds, DeckId } from 'flashcards/flashcards/types/types';
import { DeckSettings } from "flashcards/flashcards/types/deckSettings";
import { Row } from "flashcards/flashcards/actions/row/row";
import { RowData, RowId } from "flashcards/flashcards/types/rowData";
import { computed, makeAutoObservable } from "mobx";
import { entries, values } from "modules/typescript/objectEntries";
import { flattenArray } from "modules/arrays/flattenArray";
import { getDependencyGraph } from "flashcards/flashcards/actions/deck/compile/dependencies/dependencyGraph";

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
  getCards(): Card[] {
    return flattenArray(
      values(this.rows).map((row) => row.getCards())
    ) as Card[];

  @computed({ keepAlive: true })
  getDependencyGraph = getDependencyGraph;
}
