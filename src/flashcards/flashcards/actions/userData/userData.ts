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

// export const getUserData = (key: string) => {
//   return getUserData().rows?.[key]?.value || null;
// };

export const setUserDataKey = (
  key: string,
  value: any,
  type?: UserDataRows[string]["type"]
) => {
  throw new Error("Not implemented");

  if (key.length > 20) {
    throw new Error("Max key length is 20");
  }
  if (!("rows" in getUserData())) {
    getUserData().rows = {};
  }
  getUserData().rows[key] = {
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
    ...(getUserData() || {}),
    ...userData,
    // lastSaved: getTime(),
  } as UserData;

  if (options.assignToDeck) {
    if (!toSave.rows) {
      console.warn({ toSave, userData_input: userData });
      throw new Error(`saveUserDataInLocalStorage didn't receive rows`);
    }
    getUserData() = toSave;
  }
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    saveInLocalStorage("vocabulary-user-data", toSave);
  }, 1000);
};

// if (isBrowser) {
//   window["getUserData"] = getUserData;
// }
