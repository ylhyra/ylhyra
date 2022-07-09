import { Store } from "flashcards/store";
import {
  IUserDataValue,
  UserDataValue,
  UserDataValueTypes,
} from "flashcards/userData/userDataValue";
import { makeAutoObservable, observable, toJS } from "mobx";
import { getFromLocalStorage } from "modules/localStorage";
import { Timestamp } from "modules/time";

export const storeKeysToSave: Readonly<(keyof Store)[]> = [
  // user ?!
  "userSettings",
  "deckOrder",
] as const;

export type SyncedUserDataStore = {
  userId: string;
  lastSynced: Timestamp;
  values: {
    [keys: string]: IUserDataValue;
  };
};

/**
 * Key-value store that makes syncing and local storage easier
 * by wrapping each value in a {@link UserDataValue}.
 */
export class UserDataStore {
  /** This value always comes from the server */
  lastSynced: Timestamp = getFromLocalStorage("lastSynced") || 0;
  userId?: string;
  values: {
    [keys: string]: UserDataValue;
  } = {};
  valuesByType: {
    [K in keyof UserDataValueTypes]?: Record<string, UserDataValue<K>>;
  } = {};
  isSyncing = false;

  constructor() {
    makeAutoObservable(this, {
      valuesByType: observable.shallow,
    });
  }

  set({
    key,
    value,
    type,
    needsSyncing = true,
    isInitializing = false,
  }: IUserDataValue & {
    isInitializing?: boolean;
  }) {
    if (key in this.values) {
      Object.assign(this.values[key].value, value);
      //Todo, fix updatedAt
      if (!needsSyncing) {
        this.values[key].needsSyncing = false;
      }
    } else {
      this.values[key] = new UserDataValue(
        type,
        key,
        value,
        needsSyncing,
        isInitializing,
        this,
      );
    }
    if (type) {
      if (!(type in this.valuesByType)) {
        this.valuesByType[type] = {};
      }
      this.valuesByType[type]![key] = this.values[key];
    }
  }
}

export const userDataStore = new UserDataStore();

// @ts-ignore
window["userDataStore"] = () => toJS(userDataStore);
