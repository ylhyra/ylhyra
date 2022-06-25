import isEmptyObject from "is-empty-object";

export function isEmpty(input: Array<any> | object) {
  if (Array.isArray(input)) {
    return input.length === 0;
  } else {
    return isEmptyObject(input);
  }
}
