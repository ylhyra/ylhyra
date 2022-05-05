import { NullOrUndefined } from "modules/typescript/nullOrUndefined";

export type EmptyObject = {
  [K in any]: never;
};

export type EmptyObjectIfNull<T extends any | NullOrUndefined> =
  T extends NullOrUndefined ? EmptyObject : T;
