import { userDataStore } from "flashcards/userData/userDataStore";
import { action } from "mobx";

/**
 * TODO:
 *
 * - Skrá notanda í gögn!
 * - Tékka hvort notandi sé enn skráður inn
 *   og hvort sami notandi sé enn skráður inn
 */
export const sync = action(async (): Promise<void> => {
  userDataStore.isSyncing = true;

  // const unsynced: Record<string, UserDataValueData> = {};
  // for (const key in userDataStore.values) {
  //   if (userDataStore.values[key].needsSyncing) {
  //     unsynced[key] = userDataStore.values[key].getValues();
  //   }
  // }
  // const { lastSynced } = userDataStore;
  // if (!isUserLoggedIn()) {
  //   log(`Not synced to server as user isn't logged in`);
  //   return;
  // }
  //
  // const response = (await axios2.post(`/api/vocabulary/sync`, {
  //   unsynced,
  //   lastSynced: lastSynced || 0,
  //   // TODO: USER!
  // })) as SyncedUserDataStore;
  //
  // for (const key in response.values) {
  //   userDataStore.set({
  //     key,
  //     value: response.values[key].value,
  //     type: response.values[key].type,
  //     // updatedAt: response.values[key].updatedAt,
  //     needsSyncing: false,
  //   });
  // }
  //
  // for (const key in unsynced) {
  //   userDataStore.values[key].needsSyncing = false;
  //   saveUserDataValueInLocalStorage(userDataStore.values[key]);
  // }
  //
  // userDataStore.lastSynced = response.lastSynced;
  // saveInLocalStorage("lastSynced", response.lastSynced);
  //
  // if (Object.keys(response.values).length > 0) {
  //   applyChangesToMainStore();
  // }
  //
  // log("Data synced");
  // setTimeout(() => {
  //   userDataStore.isSyncing = false;
  // }, 0);
});

let timer: NodeJS.Timeout;
export function syncDebounced() {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    void sync();
  }, 1000 * 1);
}
