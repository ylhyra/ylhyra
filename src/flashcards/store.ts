import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { CardId, DeckId, ScheduleData } from "flashcards/flashcards/types";
import { UserId, Username } from "flashcards/user/types";
import { UserSettings } from "flashcards/user/userSettings.types";
import { makeObservable, observable } from "mobx";
import { Seconds, Timestamp } from "modules/time";

export class Store {
  @observable user: {
    userId: UserId;
    username: Username;
  } | null = null;
  @observable userSettings: UserSettings = {};
  @observable decks: Record<DeckId, Deck> = {};
  @observable deckOrder: DeckId[] = [];
  @observable schedule: Record<CardId, ScheduleData> = {};
  @observable sessions: Record<
    string,
    {
      secondsSpent: Seconds;
      timestamp: Timestamp;
    }
  > = {};
  lastSynced?: Timestamp;
  needsSyncing = new Set<string>();
  /** Separate from settings since user may not wish to sync this */
  @observable volume: boolean = true;
  constructor() {
    makeObservable(this);
  }
}

export const store = new Store();
