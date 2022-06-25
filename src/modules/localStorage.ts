import { toJS } from "mobx";
import { isBrowser } from "modules/isBrowser";

const compressed_keys = [];

/* Helper functions to stringify in local storage */
export function saveInLocalStorage(name: string, input: any) {
  /** Strip MobX proxies */
  input = toJS(input);
  if (!isBrowser) return;
  let data;
  if (!input || (Array.isArray(input) && input.length === 0)) {
    data = "";
  } else {
    data = JSON.stringify(input);
  }

  // /* This is not currently used since it is too slow */
  // if (data && compressed_keys.includes(name)) {
  //   console.time("Data compression");
  //   data = compressToBase64(data);
  //   console.timeEnd("Data compression");
  // }

  localStorage.setItem(name, data);
}

export function getFromLocalStorage(name: string): any {
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
}
