import { isDev } from "modules/isDev";
import { shuffle } from "underscore";

/**
 * Shuffles an array just a little bit, while keeping items in their locality.
 * @param array
 * @param range - Split array into groups of this size, and then shuffle within these groups.
 */
export const shuffleLocally = (array: any[], range = 10): any[] => {
  // if (isDev) return array;

  let out: any[] = [];
  for (let i = 0; i < array.length; i += range) {
    out = out.concat(shuffle(array.slice(i, i + range)));
  }
  return out;
};
