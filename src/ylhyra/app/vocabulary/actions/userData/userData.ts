import { isBrowser } from "modules/isBrowser";
import { Timestamp } from "modules/time";
import { saveInLocalStorage } from "ylhyra/app/app/functions/localStorage";
import { deck } from "ylhyra/app/vocabulary/actions/deck";

export type UserData = {
  lastSynced: Timestamp;
  rows: UserDataRows;
  /** TODO */
  user_id?: string;
};
export type UserDataRows = {
  [keys: string]: {
    value: string;
    type: "schedule" | "session" | null;
    needsSyncing?: boolean;
  };
};

export const getUserData = (key: string) => {
  return deck?.user_data?.rows?.[key]?.value || null;
};

export const setUserData = (
  key: string,
  value: any,
  type?: UserDataRows[string]["type"]
) => {
  if (key.length > 20) {
    throw new Error("Max key length is 20");
  }
  if (!("rows" in deck!.user_data)) {
    (deck!.user_data as UserData).rows = {};
  }
  deck!.user_data.rows[key] = {
    value,
    needsSyncing: true, // getTime(),
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
    // lastSaved: getTime(),
  } as UserData;

  if (deck && options.assignToDeck) {
    if (!toSave.rows) {
      console.warn({ toSave, user_data_input: user_data });
      throw new Error(`saveUserDataInLocalStorage didn't receive rows`);
    }
    deck!.user_data = toSave;
  }
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    saveInLocalStorage("vocabulary-user-data", toSave);
  }, 1000);
};

if (isBrowser) {
  window["getUserData"] = getUserData;
}
