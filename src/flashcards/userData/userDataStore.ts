import { Store } from "flashcards/store";
import {
  UserDataValue,
  UserDataValueTypes,
} from "flashcards/userData/userDataValue";
import { makeAutoObservable, observable, toJS } from "mobx";
import { Timestamp } from "modules/time";

export const storeKeysToSave: Readonly<(keyof Store)[]> = [
  // user ?!
  "userSettings",
  "deckOrder",
  // "volume", // TODO: This is a primitive!
] as const;

export type SyncedUserDataStore = {
  userId: string;
  lastSynced: Timestamp;
  values: {
    [keys: string]: {
      key: InstanceType<typeof UserDataValue>["key"];
      value: InstanceType<typeof UserDataValue>["value"];
      type: InstanceType<typeof UserDataValue>["type"];
    };
  };
};

/**
 * Key-value store that makes syncing and local storage easier
 * by wrapping each value in a {@link UserDataValue}.
 */
export class UserDataStore {
  lastSynced?: Timestamp;
  userId?: string;
  values: {
    [keys: string]: UserDataValue<any>;
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
    isInitializingFromLocalStorage = false,
    needsSyncing = true,
  }: {
    key: string;
    value: any;
    type: keyof UserDataValueTypes;
    isInitializingFromLocalStorage?: boolean;
    needsSyncing?: boolean;
  }) {
    if (key in this.values) {
      Object.assign(this.values[key].value, value);
      if (!needsSyncing) {
        this.values[key].needsSyncing = false;
      }
    } else {
      this.values[key] = new UserDataValue(
        type,
        key,
        value,
        needsSyncing,
        false,
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
