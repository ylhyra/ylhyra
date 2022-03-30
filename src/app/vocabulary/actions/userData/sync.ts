import axios from "app/app/axios";
import { getFromLocalStorage } from "app/app/functions/localStorage";
import { log } from "app/app/functions/log";
import { isUserLoggedIn } from "app/user/actions";
import { deck } from "app/vocabulary/actions/deck";
import { saveUserDataInLocalStorage } from "app/vocabulary/actions/userData/userData";
import { getScheduleFromUserData } from "app/vocabulary/actions/userData/userDataSchedule";
import { clearOverview } from "app/vocabulary/elements/OverviewScreen/actions";

/**
 * TODO:
 * - skrá notanda í gögn!
 * - tékka hvort notandi sé enn skráður inn og hvort sami notandi sé enn skráður inn
 *
 * @returns {UserData}
 */
export const sync = async (options: any = {}) => {
  /** @type UserData */
  let user_data;

  if (Object.keys(deck?.user_data?.rows || {}).length > 0) {
    user_data = deck.user_data;
  } else {
    user_data = getFromLocalStorage("vocabulary-user-data") || {};
  }

  /** @type UserDataRows */
  let rows = user_data.rows || {};

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

/**
 * @param {UserDataRows} obj
 * @param {object} options
 * @returns {UserDataRows}
 */
const getUnsynced = (obj, options?) => {
  if (!obj) return {};
  const { syncEverything } = options;
  let to_save = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key].needsSyncing || syncEverything) {
      to_save[key] = obj[key];
    }
  });
  return to_save;
};

/**
 * @param {UserDataRows} local
 * @param {UserDataRows} server
 * @returns {UserDataRows}
 */
const mergeResponse = (local, server) => {
  Object.keys(local).forEach((key) => {
    delete local[key].needsSyncing;
  });
  Object.keys(server).forEach((key) => {
    local[key] = server[key];
  });
  return local;
};
