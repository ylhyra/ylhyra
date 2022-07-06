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

export type UserDataStoreTypes = "deck" | "row" | "schedule" | "sessionLog";

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
  // needsSyncing?: boolean;
  valuesByType: {
    [key in UserDataStoreTypes]?: Record<string, UserDataValue>;
  } = {};

  constructor() {
    makeAutoObservable(this);
  }

  set(
    key: string,
    value: any,
    type?: UserDataValue["type"],
    isInitializingFromLocalStorage = false,
  ) {
    if (key in this.values) {
      Object.assign(this.values[key].value, value);
    } else {
      this.values[key] = new UserDataValue(key, value, this, false, type);
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
    public parentClass: UserDataStore,
    isInitializing?: boolean,
    public type?: UserDataStoreTypes | null,
    public needsSyncing?: boolean,
  ) {
    if (!isObservable(value)) {
      throw new Error("UserDataValue: Value must be an observable");
    }
    if (!isInitializing) this.save();
    reaction(() => Object.entries(this.value), this.save);
  }
  save() {
    // sync()
    this.needsSyncing = true;
    saveInLocalStorage(FLASHCARDS_LOCALSTORAGE_PREFIX + this.key, {
      type: this.type,
      value: this.value,
    });
  }
}

export function syncedValue<T extends object>(
  type: UserDataValue["type"],
  key: string,
  value: T,
): T {
  const obs = isObservable(value) ? value : observable.object(value);
  userDataStore.set(key, obs, type);

  // // tmp
  // saveInLocalStorage(key, value);

  return obs;
}

// @ts-ignore
window["userDataStore"] = () => toJS(userDataStore);
