import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";

/**
 * Helper functions for debugging
 */
export const log = (...items: any[]) => {
  if (process.env.JEST_WORKER_ID) return;
  items.forEach((item) => {
    if (typeof item === "string" && isBrowser) {
      console.log("%c " + item, "color: #CBCBCB");
    } else {
      console.log(item);
    }
  });
};

/**
 * Log only in development mode
 */
export const logDev = (...items: any[]) => {
  if (isDev) {
    log(...items);
  }
};
