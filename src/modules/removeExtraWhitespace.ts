import { keys } from "modules/typescript/objectEntries";

export function removeExtraWhitespace(input: string) {
  if (!input) return "";
  return input.replace(/[\s]+/g, " ").trim();
}

/**
 * Used to simplify certain objects that contain user-input data.
 * Trims whitespace, and drops undefined values to make the object smaller.
 */
export const removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues = <
  T extends Record<string, any>
>(
  input: T
): Partial<T> => {
  let out: Record<string, any> = {};
  keys(input).forEach((key) => {
    /** Remove null and undefined */
    if (input[key] == null) return;
    if (typeof input[key] === "string") {
      if (!input[key].trim()) return;
      out[key] = removeExtraWhitespace(input[key]);
    } else {
      out[key] = input[key];
    }
  });
  return out as T;
};
