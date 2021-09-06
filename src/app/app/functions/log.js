import { isBrowser } from "app/app/functions/isBrowser";

/**
 * Helper function for debugging
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

// if() {
//
// }
