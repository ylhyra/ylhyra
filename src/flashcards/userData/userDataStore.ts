import { SyncedData } from "flashcards/userData/syncedData";
import { getFromLocalStorage } from "modules/localStorage";
import { Timestamp } from "modules/time";

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
  values: Record<SyncedData["key"], SyncedData> = {};

  save(input: SyncedData) {
    this.values[input.key] = input;
  }
}

// @ts-ignore
export let userDataStore = new UserDataStore();
export function clearUserDataStore() {
  userDataStore = new UserDataStore();
}
