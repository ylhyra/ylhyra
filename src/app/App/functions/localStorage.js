import { decompressFromBase64, compressToBase64 } from "lz-string";

let compressed_keys = ["vocabulary-database", "vocabulary-schedule"];

/* Helper functions to stringify in local storage */
export const saveInLocalStorage = (name, obj) => {
  let data = JSON.stringify(obj);

  if (compressed_keys.includes(name)) {
    data = compressToBase64(data);
  }

  localStorage.setItem(name, data);
};

export const getFromLocalStorage = (name) => {
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
