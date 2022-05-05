import {
  saveUserDataInLocalStorage,
  UserData,
  UserDataRows,
} from "flashcards/flashcards/actions/userData/userData";
import { getScheduleFromUserData } from "flashcards/flashcards/actions/userData/userDataSchedule";
import {
  getUserData,
  setEntireSchedule,
} from "flashcards/flashcards/userDataStore";
import { getFromLocalStorage } from "modules/localStorage";
import { log } from "modules/log";

/**
 * TODO:
 * - skrá notanda í gögn!
 * - tékka hvort notandi sé enn skráður inn og hvort sami notandi sé enn skráður inn
 */
export const sync = async (options: any = {}): Promise<UserData> => {
  let userData: UserData;

  if (Object.keys(getUserData().rows || {}).length > 0) {
    userData = getUserData();
  } else {
    userData = getFromLocalStorage("vocabulary-user-data") || {};
  }

  let rows: UserDataRows = userData.rows || {};

  const { lastSynced } = userData;

  if (!options.isInitializing) {
    saveUserDataInLocalStorage({ rows });
  }

  if (!isUserLoggedIn()) {
    log(`Not synced to server as user isn't logged in`);
    return userData;
  }

  const unsynced = getUnsynced(rows, options);

  const response = (
    await axios.post(`/api/vocabulary/sync`, {
      unsynced,
      lastSynced: lastSynced || 0,
    })
  ).data;

  /* Force recalculation of overview screen */
  if (response.rows.length > 0) clearOverview();

  rows = mergeResponse(rows, response.rows);

  userData = {
    rows,
    lastSynced: response.lastSynced,
  };
  saveUserDataInLocalStorage(userData, { assignToDeck: true });
  setEntireSchedule(getScheduleFromUserData(userData));
  log("Data synced");

  return userData;
};

export const syncIfNecessary = async () => {
  if (!deck) return;
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
};

const getUnsynced = (
  obj: UserDataRows,
  options?: { syncEverything: Boolean }
): UserDataRows => {
  if (!obj) return {};
  const { syncEverything } = options;
  let toSave = {};
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
