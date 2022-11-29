import {
  SyncedData,
  UserDataValueData,
} from "flashcards/userData/userDataValue";
import { toJS } from "mobx";
import { getFromLocalStorage } from "modules/localStorage";
import { Timestamp } from "modules/time";

export type UserDataStoreOnServer = {
  userId?: string;
  lastSynced: Timestamp;
  values: {
    [keys: string]: UserDataValueData;
  };
};

/**
 * Key-value store that makes syncing and local storage easier by wrapping each
 * value in a {@link SyncedData}.
 */
export class UserDataStore {
  /**
   * This value always comes from the server, and it is not compared with the
   * user's clock
   */
  lastSynced: Timestamp = getFromLocalStorage("lastSynced") || 0;
  userId?: string;
  values: Record<string, SyncedData> = {};

  set<K extends SyncedData>(input: K, options: { isInitializing: boolean }) {
    if (userDataStore.values[input.key]) {
      Object.assign(userDataStore.values[input.key], input);
    } else {
      userDataStore.values[input.key] = input;
    }
  }
}

export let userDataStore = new UserDataStore();
export function clearUserDataStore() {
  userDataStore = new UserDataStore();
}

// @ts-ignore
window["userDataStore"] = userDataStore;
// @ts-ignore
window["userDataStoreJs"] = () => toJS(userDataStore);
