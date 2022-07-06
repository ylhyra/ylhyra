import { Store } from "flashcards/store";
import {
  isObservable,
  makeAutoObservable,
  observable,
  reaction,
  toJS,
} from "mobx";
import { saveInLocalStorage } from "modules/localStorage";
import { Timestamp } from "modules/time";

export const FLASHCARDS_LOCALSTORAGE_PREFIX = "f:";
export const ALREADY_IN_USER_STORE = "__ALREADY_IN_USER_STORE";
export const storeKeysToSave: Readonly<(keyof Store)[]> = [
  "user",
  "userSettings",
  "deckOrder",
  "volume",
] as const;

export type UserDataStoreTypes =
  | typeof storeKeysToSave[number]
  | "deck"
  | "row"
  | "schedule"
  | "sessionLog";

/**
 * Key-value store that makes syncing and local storage easier
 * by wrapping each value in a {@link UserDataValue}.
 */
export class UserDataStore {
  lastSynced?: Timestamp;
  userId?: string;
  values: {
    [keys: string]: UserDataValue;
  } = {};
  valuesByType: {
    [key in UserDataStoreTypes]?: Record<string, UserDataValue>;
  } = {};

  constructor() {
    makeAutoObservable(this, {
      valuesByType: observable.shallow,
    });
  }

  set(
    key: string,
    value: any,
    type: UserDataStoreTypes,
    isInitializingFromLocalStorage = false,
  ) {
    if (key in this.values) {
      Object.assign(this.values[key].value, value);

      // temp testing
      setTimeout(() => {
        if (!this.values[key].needsSyncing) {
          throw new Error("Failed to mark item as needing to sync");
        }
      }, 10);
    } else {
      this.values[key] = new UserDataValue(key, value, type, false, false);
    }
    if (type) {
      if (!(type in this.valuesByType)) {
        this.valuesByType[type] = {};
      }
      this.valuesByType[type]![key] = this.values[key];
    }
  }

  get(key: string) {
    return this.values[key]?.value;
  }
}

export const userDataStore = new UserDataStore();

export class UserDataValue {
  constructor(
    public key: string,
    public value: any,
    public type: UserDataStoreTypes,
    public needsSyncing: boolean = true,
    isInitializing: boolean,
  ) {
    if (typeof key !== "string") {
      throw new Error("Key must be a string");
    }
    if (!isObservable(value)) {
      throw new Error("UserDataValue: Value must be an observable");
    }
    if (!isInitializing) this.save();
    value[ALREADY_IN_USER_STORE] = true;
    reaction(
      () => Object.entries(this.value),
      () => {
        this.save();
      },
    );
  }
  save() {
    this.needsSyncing = true;
    saveInLocalStorage(FLASHCARDS_LOCALSTORAGE_PREFIX + this.key, {
      type: this.type,
      value: this.value,
      needsSyncing: this.needsSyncing,
    });
  }
}

export function syncedValue<T extends object>(
  type: UserDataValue["type"],
  key: string,
  value: T,
): T {
  if (ALREADY_IN_USER_STORE in value) return value;
  const obs = isObservable(value) ? value : observable.object(value);
  userDataStore.set(key, obs, type);
  return obs;
}

// @ts-ignore
window["userDataStore"] = () => toJS(userDataStore);
