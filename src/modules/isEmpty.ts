import isEmptyObject from "is-empty-object";

export const isEmpty = (input: any[] | object) => {
  if (Array.isArray(input)) {
    return input.length === 0;
  } else {
    return isEmptyObject(input);
  }
};
