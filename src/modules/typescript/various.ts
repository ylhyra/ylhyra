import { FunctionKeys } from "utility-types";

export type OnlyProperties<T extends object> = Omit<T, FunctionKeys<T>>;

export function onlyProperties<T extends object>(obj: T): OnlyProperties<T> {
  const propertyKeys = Object.entries(Object.getOwnPropertyDescriptors(obj))
    .filter(
      ([, desc]) =>
        desc.hasOwnProperty("value") && typeof desc.value !== "function",
    )
    .map(([key]) => key);
  let out: Partial<typeof obj> = {};
  for (const key of propertyKeys) {
    // @ts-ignore
    out[key] = obj[key];
  }
  return out as OnlyProperties<T>;
}
