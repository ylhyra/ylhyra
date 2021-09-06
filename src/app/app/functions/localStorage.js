import { isBrowser } from "app/app/functions/isBrowser";

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

  // // TODO!! Too slow?
  // if (data && compressed_keys.includes(name)) {
  //   console.time("Data compression");
  //   data = compressToBase64(data);
  //   console.timeEnd("Data compression");
  // }

  // console.time("Saving in localstorage");
  localStorage.setItem(name, data);
  // console.timeEnd("Saving in localstorage");
};

export const getFromLocalStorage = (name) => {
  if (!isBrowser) return;
  let data = localStorage.getItem(name);
  if (!data) return null;

  // if (compressed_keys.includes(name) && !data.startsWith("{")) {
  //   data = decompressFromBase64(data) || data;
  // }

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
