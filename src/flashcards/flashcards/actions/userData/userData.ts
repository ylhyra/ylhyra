import { isBrowser } from "modules/isBrowser";
import { saveInLocalStorage } from "modules/localStorage";
import { Timestamp } from "modules/time";

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
  return deck?.userData?.rows?.[key]?.value || null;
};

export const setUserData = (
  key: string,
  value: any,
  type?: UserDataRows[string]["type"]
) => {
  if (key.length > 20) {
    throw new Error("Max key length is 20");
  }
  if (!("rows" in deck!.userData)) {
    (deck!.userData as UserData).rows = {};
  }
  deck!.userData.rows[key] = {
    value,
    needsSyncing: true, // getTime(),
    type,
  };
  saveUserDataInLocalStorage();
};

let timer: NodeJS.Timeout;
export const saveUserDataInLocalStorage = (
  userData = {},
  options: any = {}
) => {
  const toSave = {
    ...(deck?.userData || {}),
    ...userData,
    // lastSaved: getTime(),
  } as UserData;

  if (deck && options.assignToDeck) {
    if (!toSave.rows) {
      console.warn({ toSave, userData_input: userData });
      throw new Error(`saveUserDataInLocalStorage didn't receive rows`);
    }
    deck!.userData = toSave;
  }
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    saveInLocalStorage("vocabulary-user-data", toSave);
  }, 1000);
};

if (isBrowser) {
  window["getUserData"] = getUserData;
}
