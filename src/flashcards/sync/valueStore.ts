import { isObservable, makeObservable, observable, reaction, toJS } from "mobx";
import { saveInLocalStorage } from "modules/localStorage";
import { Timestamp } from "modules/time";

const FLASHCARDS_LOCALSTORAGE_PREFIX = "f:";

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

  constructor() {
    makeObservable(this, {
      values: observable.shallow,
    });
  }

  set(key: string, value: any, type?: UserDataValue["type"]) {
    const isInitializing = false;
    this.values[key] = new UserDataValue(
      key,
      value,
      this,
      isInitializing,
      type,
    );
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
    public type?: "deck" | "row" | "schedule" | "sessionLog" | null,
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
    saveInLocalStorage(FLASHCARDS_LOCALSTORAGE_PREFIX + this.key, this.value);
  }
}

export function syncedValue<T extends object>(key: string, value: T): T {
  const obs = isObservable(value) ? value : observable.object(value);
  userDataStore.set(key, obs);

  // // tmp
  // saveInLocalStorage(key, value);

  return obs;
}

// @ts-ignore
window["userDataStore"] = () => toJS(userDataStore);
