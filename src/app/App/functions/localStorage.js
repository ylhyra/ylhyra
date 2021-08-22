import { decompressFromBase64, compressToBase64 } from "lz-string";
import { isBrowser } from "app/App/functions/isBrowser";
export const ANALYTICS_LOCALSTORAGE_LABEL = "_a";

const compressed_keys = [
  "vocabulary-database",
  "vocabulary-user-data",
  "vocabulary-schedule", // Temporary, to be removed after migration
  ANALYTICS_LOCALSTORAGE_LABEL,
];

/* Helper functions to stringify in local storage */
export const saveInLocalStorage = (name, input) => {
  if (!isBrowser) return;
  let data;
  if (!input || (Array.isArray(input) && input.length === 0)) {
    data = "";
  } else {
    data = JSON.stringify(input);
  }

  if (data && compressed_keys.includes(name)) {
    data = compressToBase64(data);
  }

  localStorage.setItem(name, data);
};

export const getFromLocalStorage = (name) => {
  if (!isBrowser) return;
  let data = localStorage.getItem(name);
  if (!data) return null;

  if (compressed_keys.includes(name) && !data.startsWith("{")) {
    data = decompressFromBase64(data) || data;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};
