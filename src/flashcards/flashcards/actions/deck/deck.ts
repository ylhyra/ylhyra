import { Chapter } from "flashcards/flashcards/actions/chapter/chapter";
import { computed, observable } from "mobx";
import { Card } from "flashcards/flashcards/actions/card/card";
import { DeckData } from "flashcards/flashcards/actions/deck/deckData";
import { Row } from "flashcards/flashcards/actions/row/row";
import { RowId } from "flashcards/flashcards/actions/row/rowData";
import { flattenArray } from "modules/arrays/flattenArray";
import {
  DeckId,
  DirectionSettings,
  Direction,
} from "flashcards/flashcards/types";
import { SyncedData } from "flashcards/userData/syncedData";
import { makeAutoObservableAll } from "modules/typescript/properties";

export class Deck extends DeckData {
  deckId!: DeckId;
  deleted?: boolean;
  title?: string;
  topic?: string;
  preset?:
    | "FOREIGN_LANGUAGE_PERSONAL_USE"
    | "FOREIGN_LANGUAGE_FOR_OTHERS"
    | "NONE";
  frontSideLanguage?: string;
  frontSideSpeechSynthesis?: boolean;
  backSideLanguage?: string;
  backSideSpeechSynthesis?: boolean;
  direction?: DirectionSettings;
  sideToShowFirst?: Direction | "RANDOM";
  automaticDependencies?: boolean;
  automaticallyOccludeClashing?: boolean;
  schedulingGoal?:
    | "MEMORIZE_PERFECTLY"
    | "MEMORIZE_WELL"
    | "SEE_MANY_CARDS"
    | "CRAM";
  schedulingNewCardsPrioritization?:
    | "PRIORITIZE_LOWER_RANK"
    | "PRIORITIZE_IMPORTANCE"
    | "PRIORITIZE_RECENTLY_ADDED";
  schedulingSeenCardsPrioritization?:
    | "PRIORITIZE_LOWER_RANK"
    | "PRIORITIZE_IMPORTANCE"
    | "PRIORITIZE_FIRST_SEEN"
    | "PRIORITIZE_RECENTLY_SEEN";
  stringReplacements?: [];
  newCardPrioritization?:
    | "RANDOM"
    | "OLDEST"
    | "NEWEST"
    | "EASIEST"
    | "HARDEST";
  oldCardPrioritization?:
    | DeckData["newCardPrioritization"]
    | "OLDEST_SEEN"
    | "NEWEST_SEEN";
  automaticReplacementsToFindAlternativeId?: [];
  /**
   * When the user is playing from all decks at once, this multiplier can be
   * used to make certain decks more important than others
   */
  deckImportanceMultiplier?: number;
  formattingStyle?: undefined | "DICTIONARY";
  newCardRate?: number;

  @observable rows: Map<RowId, Row> = new Map();
  @observable chapters: Chapter[] = [];

  constructor(data: Omit<DeckData, keyof SyncedData>) {
    super(data);
    // store.decks.set(deckId, this);
    makeAutoObservableAll(this);
  }

  // get title() {
  //   return this.settings.title || "(untitled)";
  // }

  @computed({ keepAlive: true })
  get cards(): Card[] {
    return flattenArray([...this.rows.values()].map((row) => row.cards));
  }

  /* TODO!!! Support multiple redirects */
  get redirectsToRow(): Record<string, Row> {
    let out: Record<string, Row> = {};
    for (let row of this.rows.values()) {
      row.redirects.forEach((alternativeId) => {
        out[alternativeId] = row;
      });
    }
    return out;
  }

  /** Used when editing rows */
  /** @deprecated */
  get rowsAsArray(): Row[] {
    console.log("rowsAsArray called");
    return [...this.rows.values()].sort((a, b) => a.rowNumber - b.rowNumber);
  }
}
