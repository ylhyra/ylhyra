import { DeckId, RowsObject } from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";
import { DeckSettings } from "flashcards/flashcards/types/deckSettings";

export class deck {
  deckId: DeckId;
  rows: RowsObject;
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
    this.rows = rows || {};
    this.settings = settings || {};
    makeAutoObservable(this);
  }
}
