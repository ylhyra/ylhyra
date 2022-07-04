import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { CardId, DeckId, ScheduleData } from "flashcards/flashcards/types";
import { saveStore } from "flashcards/sync/initialize";
import { UserId, Username } from "flashcards/user/types";
import { UserSettings } from "flashcards/user/userSettings.types";
import { makeObservable, observable, reaction } from "mobx";
import { Seconds, Timestamp } from "modules/time";

/**
 * Key-value store that makes syncing and local storage easier
 * by wrapping each value in a {@link UserDataValue}.
 */
class UserDataStore {
  lastSynced?: Timestamp;
  userId?: string;
  values: {
    [keys: string]: UserDataValue;
  } = {};
  constructor() {
    makeObservable(this, {
      values: observable.shallow,
    });
  }
  set(key: string, value: any, type?: UserDataValue["type"]) {
    this.values[key] = new UserDataValue(key, value, type);
  }
  get(key: string) {
    return this.values[key]?.value;
  }
}

class UserDataValue {
  constructor(
    public key: string,
    public value: any,
    public type?: "deck" | "row" | "schedule" | "sessionLog" | null,
    public needsSyncing?: boolean
  ) {
    makeObservable(this, {
      value: observable,
    });
    reaction(
      () => this.value,
      () => {
        this.needsSyncing = true;
      }
    );
  }
}

export class Store {
  @observable user: {
    userId: UserId;
    username: Username;
  } | null = null;
  @observable userSettings: UserSettings = {};
  @observable decks: Record<DeckId, Deck> = {};
  @observable deckOrder: DeckId[] = [];
  @observable schedule: Record<CardId, ScheduleData> = {};
  @observable sessionLog: Record<
    string,
    {
      deckId?: DeckId;
      secondsSpent: Seconds;
      timestamp: Timestamp;
    }
  > = {};
  /** Separate from settings since user may not wish to sync this */
  @observable volume: boolean = true;
  lastSynced?: Timestamp;
  constructor() {
    makeObservable(this);
    reaction(() => [Object.keys(this.decks), this.deckOrder], saveStore);
  }
}

export const store = new Store();
