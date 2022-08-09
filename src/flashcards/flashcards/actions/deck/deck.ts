import { computed, makeObservable, observable } from "mobx";
import { Card } from "flashcards/flashcards/actions/card/card";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { getDependencyGraph } from "flashcards/flashcards/actions/dependencies/dependencyGraph";
import { Row } from "flashcards/flashcards/actions/row/row";
import { RowId } from "flashcards/flashcards/actions/row/rowData.types";
import {
  DeckId,
  DependenciesForAllRowsAsRowIdToDependencyToDepth,
} from "flashcards/flashcards/types";
import { flattenArray } from "modules/arrays/flattenArray";
import { store } from "../../../store";

export class Deck {
  @observable rows: Map<RowId, Row> = new Map();
  @observable settings: DeckSettings;
  constructor(public deckId: DeckId, settings?: DeckSettings) {
    this.settings = settings || {};
    // this.settings = userDataStore.set({
    //   type: "deck",
    //   key: this.deckId,
    //   value: this.settings,
    //   obj: this,
    // });
    store.decks.set(deckId, this);
    makeObservable(this);
  }

  get title() {
    return this.settings.title || "(untitled)";
  }

  @computed({ keepAlive: true })
  get cards(): Card[] {
    return flattenArray([...this.rows.values()].map((row) => row.cards));
  }

  get rowRedirects(): Record<string, RowId> {
    let out: Record<string, RowId> = {};
    for (let row of this.rows.values()) {
      row.redirects.forEach((alternativeId) => {
        out[alternativeId] = row.rowId;
      });
    }
    return out;
  }

  /** Used when editing rows */
  get rowsAsArray(): Row[] {
    console.log("rowsAsArray called");
    return [...this.rows.values()].sort(
      (a, b) => a.data.rowNumber - b.data.rowNumber,
    );
  }

  @computed({ keepAlive: true })
  get dependencyGraph(): DependenciesForAllRowsAsRowIdToDependencyToDepth {
    return getDependencyGraph.bind(this)();
  }
}
