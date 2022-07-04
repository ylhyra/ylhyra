import { Card } from "flashcards/flashcards/actions/card/card";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { getDependencyGraph } from "flashcards/flashcards/actions/dependencies/dependencyGraph";
import { Row } from "flashcards/flashcards/actions/row/row";
import {
  RowData,
  RowId,
} from "flashcards/flashcards/actions/row/rowData.types";
import {
  DeckId,
  DependenciesForAllRowsAsRowIdToDependencyToDepth,
} from "flashcards/flashcards/types";
import { saveStore } from "flashcards/sync/initialize";
import { computed, makeObservable, observable, reaction } from "mobx";
import { flattenArray } from "modules/arrays/flattenArray";

export class Deck {
  deckId: DeckId;
  @observable rows: Row[] = [];
  @observable settings: DeckSettings = {};
  constructor({
    deckId,
    settings,
    rows,
  }: {
    deckId: DeckId;
    settings?: DeckSettings;
    rows?: RowData[];
  }) {
    this.deckId = deckId;
    this.settings = settings || {};
    if (rows) {
      this.rows = rows.map((rowData) => {
        return new Row(this, rowData);
      });
    }
    makeObservable(this);

    /* Auto save */
    reaction(
      () => [Object.keys(this.rows), Object.entries(this.settings)],
      saveStore
    );
  }

  get title() {
    return this.settings.title || "(untitled)";
  }

  // get cardIds(): CardIds {
  //   return flattenArray(values(this.rows).map((row) => row.cards)) as CardIds;
  // }

  @computed({ keepAlive: true })
  get cards(): Card[] {
    return flattenArray(this.rows.map((row) => row.cards));
  }

  get rowRedirects(): Record<string, RowId> {
    let out: Record<string, RowId> = {};
    this.rows.forEach((row) => {
      row.redirects.forEach((alternativeId) => {
        out[alternativeId] = row.rowId;
      });
    });
    return out;
  }

  @computed({ keepAlive: true })
  get dependencyGraph(): DependenciesForAllRowsAsRowIdToDependencyToDepth {
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
