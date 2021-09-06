import { isBrowser } from "app/app/functions/isBrowser";
import { isDev } from "app/app/functions/isDev";

/**
 * Helper function for debugging
 */
export const log = (...items) => {
  if (isDev) {
    items.forEach((item) => {
      if (typeof item === "string" && isBrowser) {
        console.log("%c " + item, "color: gray");
      } else {
        console.log(item);
      }
    });
  }
};
