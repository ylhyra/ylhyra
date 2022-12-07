import { FunctionKeys } from "utility-types";
import { makeObservable } from "mobx";

export type OnlyProperties<T extends object> = Omit<T, FunctionKeys<T>>;

export function onlyProperties<T extends object>(obj: T): OnlyProperties<T> {
  let out: Partial<typeof obj> = {};
  for (const key of onlyPropertyKeys(obj)) {
    // @ts-ignore
    out[key] = obj[key];
  }
  return out as OnlyProperties<T>;
}

export function onlyPropertyKeys(obj: object): string[] {
  return Object.entries(Object.getOwnPropertyDescriptors(obj))
    .filter(
      ([, desc]) =>
        desc.hasOwnProperty("value") && typeof desc.value !== "function",
    )
    .map(([key]) => key);
}

export function makeAutoObservableAll(obj: object) {
  let keys = Object.keys(obj);
  let k: Record<string, boolean> = {};
  for (const key of keys) {
    k[key] = true;
  }
  makeObservable(obj, k);
}
