import { log } from "modules/log";
import axios from "ylhyra/app/app/axios";
import { getFromLocalStorage } from "ylhyra/app/app/functions/localStorage";
import { isUserLoggedIn } from "ylhyra/app/user/actions";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import {
  saveUserDataInLocalStorage,
  UserData,
  UserDataRows,
} from "ylhyra/app/vocabulary/actions/userData/userData";
import { getScheduleFromUserData } from "ylhyra/app/vocabulary/actions/userData/userDataSchedule";
import { clearOverview } from "ylhyra/app/vocabulary/elements/OverviewScreen/actions";

/**
 * TODO:
 * - skrá notanda í gögn!
 * - tékka hvort notandi sé enn skráður inn og hvort sami notandi sé enn skráður inn
 */
export const sync = async (options: any = {}): Promise<UserData> => {
  let user_data: UserData;

  if (Object.keys(deck?.user_data?.rows || {}).length > 0) {
    user_data = deck!.user_data;
  } else {
    user_data = getFromLocalStorage("vocabulary-user-data") || {};
  }

  let rows: UserDataRows = user_data.rows || {};

  const { lastSynced } = user_data;

  if (!options.isInitializing) {
    saveUserDataInLocalStorage({ rows });
  }

  if (!isUserLoggedIn()) {
    log(`Not synced to server as user isn't logged in`);
    return user_data;
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

  user_data = {
    rows,
    lastSynced: response.lastSynced,
  };
  saveUserDataInLocalStorage(user_data, { assignToDeck: true });
  if (deck) {
    deck.schedule = getScheduleFromUserData(user_data);
  }
  log("Data synced");

  return user_data;
};

export const syncIfNecessary = async () => {
  if (!deck) return;
  // TODO
  // const data = getFromLocalStorage("vocabulary-user-data");
  // /* Localstorage data has been updated in another tab, so we reload */
  // if (data) {
  //   if (data.lastSaved > deck.lastSaved) {
  //     saveUserDataInLocalStorage(data, { assignToDeck: true });
  //   }
  // }
  // if (isUserLoggedIn()) {
  //   /* Sync if more than 10 minutes since sync */
  //   if (now() > deck.lastSynced + 10 * 60 * 1000) {
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
