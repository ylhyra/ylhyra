import { CardId, ScheduleData } from "flashcards/flashcards/types";
import { computed, makeAutoObservable } from "mobx";
import { saveInLocalStorage } from "modules/localStorage";
import { Seconds, Timestamp } from "modules/time";

export type Schedule = Record<CardId, ScheduleData>;

export interface UserData {
  data: UserDataRows;
  lastSynced?: Timestamp;
  /** TODO: Make sure userId matches on both ends */
  userId?: string;
}

export type UserDataRows = Record<
  string,
  | {
      type: undefined;
      value: string;
    }
  | {
      type: "session";
      value: {
        secondsSpent: Seconds;
        timestamp: Timestamp;
      };
    }
  | {
      type: "schedule";
      value: ScheduleData;
    }
>;

export class UserDataStore implements UserData {
  data: UserDataRows = {};
  userId?: string;
  lastSynced?: Timestamp;
  needsSyncing = new Set();
  constructor() {
    makeAutoObservable(this);
  }

  set(
    key: string,
    value: UserDataRows[string]["value"],
    type?: UserDataRows[string]["type"]
  ) {
    if (key.length > 20) throw new Error("Max key length is 20");
    // @ts-ignore
    this.data[key] = {
      value,
      type,
    };
    this.needsSyncing.add(key);
    // todo verify
    saveInLocalStorage("vocabulary-user-data", this);
  }

  @computed
  get schedule(): Schedule {
    const schedule: Schedule = {};
    for (const key of Object.keys(this.data)) {
      if (this.data[key].type === "schedule") {
        schedule[key as CardId] = this.data[key].value as ScheduleData;
      }
    }
    return schedule;
  }

  @computed
  get sessions(): any[] {
    const sessions = [];
    for (const key of Object.keys(this.data)) {
      if (this.data[key].type === "session") {
        sessions.push(getUserDataStore().data[key].value);
      }
    }
    return sessions;
  }
}

const store = new UserDataStore();
export const getUserDataStore = (): UserDataStore => store;
