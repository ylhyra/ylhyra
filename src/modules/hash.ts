import stable_stringify from "json-stable-stringify";
// @ts-ignore
import hash from "string-hash";

/**
 * Stable hash of any item
 */
export default function (input: any): string {
  if (typeof input === "object") {
    input = stable_stringify(input);
  } else if (typeof input !== "string") {
    input = JSON.stringify(input);
  }
  return hash(input).toString(36);
}
