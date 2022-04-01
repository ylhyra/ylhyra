import { isBrowser } from "modules/isBrowser";
import { saveInLocalStorage } from "ylhyra/app/app/functions/localStorage";
import { getTime, Timestamp } from "ylhyra/app/app/functions/time";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import { keys } from "mobx";

export type UserData =
  | {
      lastSynced: Timestamp;
      rows: UserDataRows;
      /** TODO */
      user_id?: string;
    }
  | {};
export type UserDataRows = {
  [keys: string]: {
    value: string;
    needsSync: boolean;
    type: "schedule" | null;
  };
};

export const getUserData = (key: string) => {
  // @ts-ignore
  return deck?.user_data?.rows?.[key]?.value || null;
};

export const setUserData = (
  key: string,
  value: any,
  type?: "schedule" | null
) => {
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

let timer: NodeJS.Timeout;
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
