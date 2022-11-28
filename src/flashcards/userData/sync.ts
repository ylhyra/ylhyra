import { action } from "mobx";
import { isUserLoggedIn } from "flashcards/user/login/actions";
import { saveUserDataValueInLocalStorage } from "flashcards/userData/localStorage";
import {
  SyncedUserDataStore,
  userDataStore,
} from "flashcards/userData/userDataStore";
import {
  UserDataValueData,
  UserDataValue,
} from "flashcards/userData/userDataValue";
import axios2 from "modules/axios2";
import { saveInLocalStorage } from "modules/localStorage";
import { log } from "modules/log";
import { applyChangesToMainStore } from "./initialize";

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

  const unsynced: Record<string, UserDataValueData> = {};
  for (const [key, value] of userDataStore.values) {
    if (value.needsSyncing) {
      unsynced[key] = value.getValues();
    }
  }

  const response = (await axios2.post(`/api/vocabulary/sync`, {
    unsynced,
    lastSynced: userDataStore.lastSynced || 0,
    // TODO: USER!
  })) as SyncedUserDataStore;

  let valuesToApplyToMainStore: UserDataValue[] = [];
  for (const key in response.values) {
    const alreadyInMainStore = userDataStore.values.has(key);
    const value = userDataStore.set({
      key: key,
      value: response.values[key].value,
      type: response.values[key].type,
      needsSyncing: false,
    });
    if (!alreadyInMainStore) {
      valuesToApplyToMainStore.push(value);
    }
  }
  applyChangesToMainStore(valuesToApplyToMainStore);

  for (const key in unsynced) {
    userDataStore.values.get(key)!.needsSyncing = false;
    saveUserDataValueInLocalStorage(userDataStore.values.get(key)!);
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
