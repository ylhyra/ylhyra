import { isBrowser } from "app/app/functions/isBrowser";
import { isDev } from "app/app/functions/isDev";

/**
 * Helper functions for debugging
 * Logs for everyone
 */
export const log = (...items) => {
  items.forEach((item) => {
    if (typeof item === "string" && isBrowser) {
      console.log("%c " + item, "color: gray");
    } else {
      console.log(item);
    }
  });
};

/**
 * Logs in development mode
 */
export const log_dev = (...items) => {
  if (isDev) {
    log(...items);
  }
};
