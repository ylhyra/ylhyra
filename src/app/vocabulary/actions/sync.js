import { deck } from "app/vocabulary/actions/deck";
import {
  getFromLocalStorage,
  saveInLocalStorage,
} from "app/app/functions/localStorage";
import { isBrowser } from "app/app/functions/isBrowser";
import { isUserLoggedIn } from "app/user/actions";
import { log } from "app/app/functions/log";
import { getTime } from "app/app/functions/time";
import axios from "app/app/axios";

export const SESSION_PREFIX = "s_";

/**
 * @typedef {Object} UserData
 * @property {string} user_id
 * @property {TimestampInMilliseconds} lastSynced
 * @property {UserDataRows} rows
 */
/**
 * @typedef {Object.<string, {
 *   value: string,
 *   needsSyncing: boolean,
 *   type: ("schedule"|null)
 * }>|Object} UserDataRows
 */

/**
 * In other words, user data is stored on: {
 *   user_id,
 *   lastSynced,
 *   rows: {
 *     [key]: {
 *       value,
 *       needsSyncing,
 *     }
 *   }
 * }
 */

/**
 * TODO:
 * - skrá notanda í gögn!
 * - tékka hvort notandi sé enn skráður inn og hvort sami notandi sé enn skráður inn
 *
 * @returns {UserData}
 */
export const sync = async (options = {}) => {
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

/**
 * @param {UserData} user_data
 * @returns {Object.<CardID, ScheduleData>}
 */
export const getScheduleFromUserData = (user_data) => {
  const schedule = {};
  Object.keys(user_data?.rows || {}).forEach((key) => {
    if (user_data.rows[key].type === "schedule") {
      schedule[key] = user_data.rows[key].value;
    }
  });
  return schedule;
};

/**
 * @returns {Array}
 */
export const getSessions = () => {
  const sessions = [];
  Object.keys(deck?.user_data?.rows || {}).forEach((key) => {
    if (deck.user_data.rows[key].type === "session") {
      sessions.push(deck.user_data.rows[key].value);
    }
  });
  return sessions;
};

export const setUserData = (key, value, type) => {
  if (key.length > 20) {
    throw new Error("Max key length is 20");
  }
  if (!("rows" in deck.user_data)) {
    // console.log(`deck.user_data didn't have rows`);
    deck.user_data.rows = {};
  }
  deck.user_data.rows[key] = {
    value,
    needsSyncing: getTime(),
    type,
  };
  saveUserDataInLocalStorage();
};

export const getUserData = (key) => {
  return deck?.user_data?.rows?.[key]?.value || null;
};
if (isBrowser) {
  window.getUserData = getUserData;
}

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
    lastSaved: getTime(),
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

/**
 * @param {UserDataRows} obj
 * @param {object} options
 * @returns {UserDataRows}
 */
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
