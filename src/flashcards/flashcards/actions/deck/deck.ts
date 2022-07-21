import { Card } from "flashcards/flashcards/actions/card/card";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { getDependencyGraph } from "flashcards/flashcards/actions/dependencies/dependencyGraph";
import { Row } from "flashcards/flashcards/actions/row/row";
import { RowId } from "flashcards/flashcards/actions/row/rowData.types";
import {
  DeckId,
  DependenciesForAllRowsAsRowIdToDependencyToDepth,
} from "flashcards/flashcards/types";
import { makeSynced } from "flashcards/userData/userDataStore";
import { computed, makeObservable, observable } from "mobx";
import { flattenArray } from "modules/arrays/flattenArray";

export class Deck {
  /** @deprecated */
  @observable rows: Row[] = [];
  @observable rowsMap: Map<RowId, Row[]>;
  @observable settings: DeckSettings;
  constructor(public deckId: DeckId, settings?: DeckSettings) {
    // this.settings = syncedValue({
    //   type: "deck",
    //   key: deckId,
    //   value: settings || {},
    // });
    // this.rowsMap = userDataStore.observingMap("row", { deckId });
    this.settings = settings || {};
    this.rowsMap = new Map();
    makeSynced(this);
    makeObservable(this);
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
