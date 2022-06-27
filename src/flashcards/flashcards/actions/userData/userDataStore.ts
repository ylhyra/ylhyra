import { CardId, ScheduleData } from "flashcards/flashcards/types";
import { computed, makeAutoObservable } from "mobx";
import { Timestamp } from "modules/time";

export type Schedule = Record<CardId, Partial<ScheduleData>>;

export interface UserData {
  lastSynced?: Timestamp;
  rows: UserDataRows;
  /** TODO: Make sure data matches on both ends */
  userId?: string;
}

export type UserDataRows = Record<
  string,
  {
    value: string;
    type: "session" | null | undefined;
  }
> &
  Record<
    CardId,
    {
      value: ScheduleData;
      type: "schedule";
    }
  >;

export class UserDataStore implements UserData {
  rows: UserDataRows = {};
  userId?: string;
  lastSynced?: Timestamp;
  needsSyncing = new Set();
  constructor() {
    makeAutoObservable(this);
  }

  @computed
  get schedule(): Schedule {
    const schedule: Schedule = {};
    Object.keys(this.rows || {}).forEach((key) => {
      if (this.rows[key].type === "schedule") {
        schedule[key as CardId] = this.rows[key].value as ScheduleData;
      }
    });
    return schedule;
  }
}

const store = new UserDataStore();
export const getUserData = (): UserDataStore => store;
export function setUserData(input: UserData) {
  store.userData = input;
}
