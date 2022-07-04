import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { CardId, DeckId, ScheduleData } from "flashcards/flashcards/types";
import { saveStore } from "flashcards/sync/initialize";
import { UserId, Username } from "flashcards/user/types";
import { UserSettings } from "flashcards/user/userSettings.types";
import { makeObservable, observable, reaction } from "mobx";
import { Seconds, Timestamp } from "modules/time";

// export type SYNC_STORE = Record<
//   string,
//   {
//     type: "deck";
//     data: DeckSettings;
//   }
// >;
//
// const keyValueStore = {};

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
  set(key: string, value: any, type?: UserDataValue["type"]) {}
  get(key: string) {
    return this.values[key]?.value;
  }
}

class UserDataValue {
  constructor(
    public key: string | "userSettings" | "deckOrder",
    public value: any,
    public type?: "schedule" | "sessionLog" | "row" | "deck" | null,
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

class Store {
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
      secondsSpent: Seconds;
      timestamp: Timestamp;
    }
  > = {};
  /** Separate from settings since user may not wish to sync this */
  @observable volume: boolean = true;
  constructor() {
    makeObservable(this);
    reaction(() => [Object.keys(this.decks), this.deckOrder], saveStore);
  }
}

export const store = new Store();
