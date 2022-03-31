import { isBrowser } from "modules/isBrowser";
import { saveInLocalStorage } from "ylhyra/app/app/functions/localStorage";
import { getTime } from "ylhyra/app/app/functions/time";
import { deck } from "ylhyra/app/vocabulary/actions/deck";

// /**
//  * @typedef {Object} UserData
//  * @property {string} user_id
//  * @property {Timestamp} lastSynced
//  * @property {UserDataRows} rows
//  */
// /**
//  * @typedef {Object.<string, {
//  *   value: string,
//  *   needsSyncing: boolean,
//  *   type: ("schedule"|null)
//  * }>|Object} UserDataRows
//  */

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

export const getUserData = (key) => {
  return deck?.user_data?.rows?.[key]?.value || null;
};

export const setUserData = (key: string, value, type?) => {
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

let timer;
export const saveUserDataInLocalStorage = (
  user_data = {},
  options: any = {}
) => {
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

if (isBrowser) {
  window["getUserData"] = getUserData;
}
