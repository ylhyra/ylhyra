import { keys } from "modules/typescript/objectEntries";

/**
 * Returns an object with the same keys but with the values having been processed by the given function.
 */
export const applyFunctionToEachObjectValue = <K extends string, T>(
  input: Record<K, T>,
  fn: (arg0: T) => any
) => {
  let out: Record<string, any> = {};
  keys(input).forEach((key) => {
    out[key] = fn(input[key]);
  });
  return out;
};
