import { UserDataStore, userDataStore } from "flashcards/sync/userDataStore";
import { isUserLoggedIn } from "flashcards/user/login/actions";
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
export const sync = async (): Promise<void> => {
  const unsynced: InstanceType<typeof UserDataStore>["values"] = {};
  for (const key in userDataStore.values) {
    if (userDataStore.values[key].needsSyncing) {
      unsynced[key] = userDataStore.values[key];
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
  })) as InstanceType<typeof UserDataStore>["values"];

  for (const key in response) {
    userDataStore.set(
      key,
      response[key].value,
      response[key].type,
      false,
      true,
    );
  }

  for (const key in unsynced) {
    unsynced[key].needsSyncing = false;
  }
  // hmm
  userDataStore.lastSynced = response.lastSynced as any as Timestamp;

  log("Data synced");
};

let timer: NodeJS.Timeout;
export function waitAndSync() {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    void sync();
  }, 1000 * 1);
}
