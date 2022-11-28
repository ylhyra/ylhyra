import { UserDataValue } from "flashcards/userData/userDataValue";
import { saveInLocalStorage } from "modules/localStorage";

/** Prefix to prevent possible clashes in localStorage */
export const FLASHCARDS_LOCALSTORAGE_PREFIX = "f:";

export function saveUserDataValueInLocalStorage(obj: UserDataValue) {
  saveInLocalStorage(FLASHCARDS_LOCALSTORAGE_PREFIX + obj.key, {
    type: obj.type,
    value: obj.value,
    needsSyncing: obj.needsSyncing,
  });
}

export function clearLocalStorage() {
  Object.keys(localStorage).forEach((_key) => {
    if (
      _key.startsWith(FLASHCARDS_LOCALSTORAGE_PREFIX) ||
      _key === "lastSynced"
    ) {
      localStorage.removeItem(_key);
    }
    localStorage.removeItem(_key);
  });
}
