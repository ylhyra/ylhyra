// import { UserDataRows } from "flashcards/user/userData/userData";
//
// /**
//  * TODO:
//  *
//  * - Skrá notanda í gögn!
//  * - Tékka hvort notandi sé enn skráður inn
//  *   og hvort sami notandi sé enn skráður inn
//  */
export const sync = async (options: any = {}): Promise<void> => {
  //   // let userData: UserData;
  //   //
  //   // if (Object.keys(getUserDataStore().data || {}).length > 0) {
  //   //   userData = getUserDataStore();
  //   // } else {
  //   //   userData = getFromLocalStorage("vocabulary-user-data") || {};
  //   // }
  //   //
  //   // let rows: UserDataRows = userData.data || {};
  //   //
  //   // const { lastSynced } = userData;
  //   //
  //   // // if (!options.isInitializing) {
  //   // //   saveUserDataInLocalStorage({ rows });
  //   // // }
  //   //
  //   // if (!isUserLoggedIn()) {
  //   //   log(`Not synced to server as user isn't logged in`);
  //   //   return;
  //   // }
  //   //
  //   // const unsynced = getUnsynced(rows, options);
  //   //
  //   // const response = (await axios2.post(`/api/vocabulary/sync`, {
  //   //   unsynced,
  //   //   lastSynced: lastSynced || 0,
  //   // })) as UserData;
  //   //
  //   // rows = mergeResponse(rows, response.data);
  //   //
  //   // getUserDataStore().data = rows;
  //   // getUserDataStore().lastSynced = response.lastSynced;
  //   // getUserDataStore().needsSyncing.clear();
  //   // log("Data synced");
  // };
  //
  // export function syncIfNecessary() {
  //   // TODO
  //   // const data = getFromLocalStorage("vocabulary-user-data");
  //   // /* Localstorage data has been updated in another tab, so we reload */
  //   // if (data) {
  //   //   if (data.lastSaved > deck!.lastSaved) {
  //   //     saveUserDataInLocalStorage(data, { assignToDeck: true });
  //   //   }
  //   // }
  //   // if (isUserLoggedIn()) {
  //   //   /* Sync if more than 10 minutes since sync */
  //   //   if (now() > deck!.lastSynced + 10 * 60 * 1000) {
  //   //     // TODO
  //   //     await sync();
  //   //   }
  //   // }
};
//
// const getUnsynced = (
//   obj: UserDataRows,
//   options: { syncEverything?: boolean } = {}
// ): UserDataRows => {
//   throw new Error("");
//   // if (!obj) return {};
//   // const { syncEverything } = options;
//   // let toSave: UserDataRows = {};
//   //
//   // Object.keys(obj).forEach((key) => {
//   //   if (getUserDataStore().needsSyncing.has(key) || syncEverything) {
//   //     toSave[key] = obj[key];
//   //   }
//   // });
//   // return toSave;
// };
//
// const mergeResponse = (
//   local: UserDataRows,
//   server: UserDataRows
// ): UserDataRows => {
//   Object.keys(server).forEach((key) => {
//     local[key] = server[key];
//   });
//   return local;
// };
export {};
