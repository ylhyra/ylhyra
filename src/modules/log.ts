import { toJS } from "mobx";
import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";

/** Helper functions for debugging */
export function log(...items: any[]) {
  if (process.env.JEST_WORKER_ID || process.env.DISABLE_LOGGING) return;
  items.forEach((item) => {
    if (typeof item === "string" && isBrowser) {
      console.log("%c " + item, "color: #CBCBCB");
    } else {
      console.log(toJS(item));
    }
  });
}
export function logBrowser(...items: any[]) {
  if (isBrowser) {
    log(...items);
  }
}

/** Log only in development mode */
export function logDev(...items: any[]) {
  if (isDev) {
    log(...items);
  }
}
