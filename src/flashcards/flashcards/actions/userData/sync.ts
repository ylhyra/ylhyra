import {
  getUserData,
  UserData,
  UserDataRows,
} from "flashcards/flashcards/actions/userData/userDataStore";
import { isUserLoggedIn } from "flashcards/user/actions";
import axios2 from "modules/axios2";
import { getFromLocalStorage } from "modules/localStorage";
import { log } from "modules/log";

/**
 * TODO:
 *
 * - Skrá notanda í gögn!
 * - Tékka hvort notandi sé enn skráður inn
 *   og hvort sami notandi sé enn skráður inn
 */
export const sync = async (options: any = {}): Promise<UserData> => {
  let userData: UserData;

  if (Object.keys(getUserData().data || {}).length > 0) {
    userData = getUserData();
  } else {
    userData = getFromLocalStorage("vocabulary-user-data") || {};
  }

  let rows: UserDataRows = userData.data || {};

  const { lastSynced } = userData;

  if (!options.isInitializing) {
    saveUserDataInLocalStorage({ rows });
  }

  if (!isUserLoggedIn()) {
    log(`Not synced to server as user isn't logged in`);
    return userData;
  }

  const unsynced = getUnsynced(rows, options);

  const response = (await axios2.post(`/api/vocabulary/sync`, {
    unsynced,
    lastSynced: lastSynced || 0,
  })) as UserData;

  // /* Force recalculation of overview screen */
  // if (response.rows.length > 0) clearOverview();

  rows = mergeResponse(rows, response.data);

  userData = {
    data: rows,
    lastSynced: response.lastSynced,
  };
  saveUserDataInLocalStorage(userData, { assignToDeck: true });
  setEntireSchedule(getScheduleFromUserData(userData));
  log("Data synced");

  return userData;
};

export function syncIfNecessary() {
  // TODO
  // const data = getFromLocalStorage("vocabulary-user-data");
  // /* Localstorage data has been updated in another tab, so we reload */
  // if (data) {
  //   if (data.lastSaved > deck!.lastSaved) {
  //     saveUserDataInLocalStorage(data, { assignToDeck: true });
  //   }
  // }
  // if (isUserLoggedIn()) {
  //   /* Sync if more than 10 minutes since sync */
  //   if (now() > deck!.lastSynced + 10 * 60 * 1000) {
  //     // TODO
  //     await sync();
  //   }
  // }
}

const getUnsynced = (
  obj: UserDataRows,
  options: { syncEverything?: boolean } = {}
): UserDataRows => {
  if (!obj) return {};
  const { syncEverything } = options;
  let toSave: UserDataRows = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key].needsSyncing || syncEverything) {
      toSave[key] = obj[key];
    }
  });
  return toSave;
};

const mergeResponse = (
  local: UserDataRows,
  server: UserDataRows
): UserDataRows => {
  Object.keys(local).forEach((key) => {
    delete local[key].needsSyncing;
  });
  Object.keys(server).forEach((key) => {
    local[key] = server[key];
  });
  return local;
};
