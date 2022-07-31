import { UserDataValue } from "flashcards/userData/userDataValue";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";

/** Prefix to prevent possible clashes in localStorage */
export const FLASHCARDS_LOCALSTORAGE_PREFIX = "f:";

export function saveUserDataValueInLocalStorage(obj: UserDataValue) {
  // return; // TEMP
  saveInLocalStorage(FLASHCARDS_LOCALSTORAGE_PREFIX + obj.key, {
    type: obj.type,
    value: obj.value,
    needsSyncing: obj.needsSyncing,
  });
}

export function getUserDataValueFromLocalStorage(_key: string) {
  if (!_key.startsWith(FLASHCARDS_LOCALSTORAGE_PREFIX)) return null;
  const { type, value, needsSyncing } = getFromLocalStorage(_key);
  const key = _key.slice(FLASHCARDS_LOCALSTORAGE_PREFIX.length);
  if (!type) {
    console.error(`Could not parse key ${_key}`);
    return null;
  }
  if (typeof key !== "string") {
    console.warn({ key, value });
    throw new Error("Key must be a string");
  }
  return { key, type, value, needsSyncing };
}
