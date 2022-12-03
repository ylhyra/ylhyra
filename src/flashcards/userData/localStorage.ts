import { SyncedData } from "flashcards/userData/userDataValue";
import { saveInLocalStorage } from "modules/localStorage";
import { onlyProperties } from "modules/typescript/various";

/** Prefix to prevent possible clashes in localStorage */
export const FLASHCARDS_LOCALSTORAGE_PREFIX = "f:";

export function saveUserDataValueInLocalStorage(obj: SyncedData) {
  saveInLocalStorage(
    FLASHCARDS_LOCALSTORAGE_PREFIX + obj.key,
    onlyProperties(obj),
  );
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
