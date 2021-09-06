import { log } from "app/app/functions/log";
import axios from "app/app/axios";
import { isBrowser } from "app/app/functions/isBrowser";
import {
  getFromLocalStorage,
  saveInLocalStorage,
} from "app/app/functions/localStorage";
import { now } from "app/app/functions/time";
// import { InitializeSession } from 'app/Vocabulary/actions/session'
import { isUserLoggedIn } from "app/user/actions";
import { deck } from "app/vocabulary/actions/deck";

export const SESSION_PREFIX = "s_";

/**
 * @module Deck
 * User data is stored on
 *   user_data = {
 *        user_id,
 *        lastSynced,
 *        rows: {
 *          key: {
 *            value,
 *            needsSyncing,
 *          }
 *        }
 *      }
 * TODO:
 * - skrá notanda í gögn!
 * - tékka hvort notandi sé enn skráður inn og hvort sami notandi sé enn skráður inn
 */
export const sync = async (options = {}) => {
  // let {isInitializing}=options
  let user_data =
    deck?.user_data || getFromLocalStorage("vocabulary-user-data") || {};
  let rows = user_data.rows || {};
  const { lastSynced } = user_data;

  saveUserDataInLocalStorage({ rows });

  if (!isUserLoggedIn()) {
    console.warn(`Not synced to server as user isn't logged in`);
    return;
  }

  const unsynced = getUnsynced(rows, options);

  const response = (
    await axios.post(`/api/vocabulary/sync`, {
      unsynced,
      lastSynced: (Object.keys(unsynced).length > 0 && lastSynced) || 0,
    })
  ).data;

  // response.user_id

  rows = mergeResponse(rows, response.rows);
  const schedule = {};
  Object.keys(rows).forEach((key) => {
    if (rows[key].type === "schedule") {
      schedule[key] = rows[key].value;
    }
  });

  user_data = {
    rows,
    lastSynced: response.lastSynced,
  };

  saveUserDataInLocalStorage({ rows }, { assignToDeck: true });
  if (deck) {
    deck.schedule = schedule;
  }
  log("Data synced");

  return {
    user_data,
    schedule,
  };
};

export const setUserData = (key, value, type) => {
  if (!("rows" in deck.user_data)) {
    console.error(`deck.user_data didn't have rows`);
    deck.user_data.rows = {};
  }
  deck.user_data.rows[key] = {
    value,
    needsSyncing: now(),
    type,
  };
  saveUserDataInLocalStorage();
};

export const getUserData = (key) => {
  const val = deck.user_data?.rows?.[key]?.value;
  if (key === "easinessLevel") {
    if (!val) return 0;
    return parseInt(val);
  }
  return val || null;
};
if (isBrowser) {
  window.getUserData = getUserData;
}

export const getEasinessLevel = () => {
  return getUserData("easinessLevel");
};

export const saveScheduleForCardId = (card_id) => {
  setUserData(card_id, deck.schedule[card_id], "schedule");
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

let timer;
export const saveUserDataInLocalStorage = (user_data = {}, options = {}) => {
  const toSave = {
    ...(deck?.user_data || {}),
    ...user_data,
    lastSaved: now(),
  };
  if (deck && options.assignToDeck) {
    if (!toSave.rows) {
      console.warn({ toSave, user_data_input: user_data });
      throw new Error(`saveUserDataInLocalStorage didn't receive rows`);
    }
    deck.user_data = toSave;
  }
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    saveInLocalStorage("vocabulary-user-data", toSave);
  }, 1000);
};

const getUnsynced = (obj, options) => {
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

const mergeResponse = (local, server) => {
  Object.keys(local).forEach((key) => {
    delete local[key].needsSyncing;
  });
  Object.keys(server).forEach((key) => {
    local[key] = server[key];
  });
  return local;
};
