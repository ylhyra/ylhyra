import { action } from "mobx";
import { isUserLoggedIn } from "flashcards/user/login/actions";
import { saveUserDataValueInLocalStorage } from "flashcards/userData/localStorage";
import {
  UserDataStore,
  userDataStore,
} from "flashcards/userData/userDataStore";
import { SyncedData } from "flashcards/userData/syncedData";
import axios2 from "modules/axios2";
import { saveInLocalStorage } from "modules/localStorage";
import { log } from "modules/log";
import { initializeObject } from "./initialize";

/**
 * TODO:
 *
 * - Skrá notanda í gögn!
 * - Tékka hvort notandi sé enn skráður inn og hvort sami notandi sé enn skráður
 *   inn
 */
export const sync = action(async (): Promise<void> => {
  if (!isUserLoggedIn()) {
    log(`Not synced to server as user isn't logged in`);
    return;
  }

  const unsynced: Record<string, SyncedData> = {};
  for (const key in userDataStore.values) {
    const value = userDataStore.values[key];
    if (value.needsSyncing) {
      unsynced[key] = value;
    }
  }

  const response = (await axios2.post(`/api/vocabulary/sync`, {
    unsynced,
    lastSynced: userDataStore.lastSynced || 0,
    // TODO: USER!
  })) as UserDataStore;

  for (const key in response.values) {
    initializeObject(response.values[key]);
  }

  for (const key in unsynced) {
    userDataStore.values[key].needsSyncing = false;
    saveUserDataValueInLocalStorage(userDataStore.values[key]);
  }

  userDataStore.lastSynced = response.lastSynced;
  saveInLocalStorage("lastSynced", response.lastSynced);

  log("Data synced");
});

let timer: NodeJS.Timeout;
export function syncDebounced() {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    void sync();
  }, 1000 * 4);
}
