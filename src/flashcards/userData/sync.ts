import { isUserLoggedIn } from "flashcards/user/login/actions";
import {
  SyncedUserDataStore,
  userDataStore,
} from "flashcards/userData/userDataStore";
import { UserDataValue } from "flashcards/userData/userDataValue";
import { action } from "mobx";
import axios2 from "modules/axios2";
import { log } from "modules/log";
import { Timestamp } from "modules/time";

/**
 * TODO:
 *
 * - Skrá notanda í gögn!
 * - Tékka hvort notandi sé enn skráður inn
 *   og hvort sami notandi sé enn skráður inn
 */
export const sync = action(async (): Promise<void> => {
  userDataStore.isSyncing = true;

  const unsynced: Record<
    string,
    ReturnType<InstanceType<typeof UserDataValue>["getValues"]>
  > = {};
  for (const key in userDataStore.values) {
    if (userDataStore.values[key].needsSyncing) {
      unsynced[key] = userDataStore.values[key].getValues();
    }
  }
  const { lastSynced } = userDataStore;
  if (!isUserLoggedIn()) {
    log(`Not synced to server as user isn't logged in`);
    return;
  }

  const response = (await axios2.post(`/api/vocabulary/sync`, {
    unsynced,
    lastSynced: lastSynced || 0,
  })) as SyncedUserDataStore;

  for (const key in response.values) {
    userDataStore.set({
      key,
      value: response.values[key].value,
      type: response.values[key].type,
    });
  }

  for (const key in unsynced) {
    unsynced[key].needsSyncing = false;
  }
  // hmm
  userDataStore.lastSynced = response.lastSynced as any as Timestamp;

  log("Data synced");
  setTimeout(() => {
    userDataStore.isSyncing = false;
  }, 0);
});

let timer: NodeJS.Timeout;
export function syncDebounced() {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    void sync();
  }, 1000 * 1);
}
