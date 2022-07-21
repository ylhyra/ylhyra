import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { Row } from "flashcards/flashcards/actions/row/row";
import { Store } from "flashcards/store";
import {
  UserDataValue,
  UserDataValueData,
  UserDataValueTypes,
} from "flashcards/userData/userDataValue";
import { makeAutoObservable, observable, reaction, toJS } from "mobx";
import { getFromLocalStorage } from "modules/localStorage";
import { Timestamp } from "modules/time";

export const storeKeysToSave: Readonly<(keyof Store)[]> = [
  // user ?!
  "userSettings",
  "deckOrder",
] as const;

export type SyncedUserDataStore = {
  userId: string;
  lastSynced: Timestamp;
  values: {
    [keys: string]: UserDataValueData;
  };
};

/**
 * Key-value store that makes syncing and local storage easier
 * by wrapping each value in a {@link UserDataValue}.
 */
export class UserDataStore {
  /** This value always comes from the server */
  lastSynced: Timestamp = getFromLocalStorage("lastSynced") || 0;
  userId?: string;
  values: Map<string, UserDataValue> = new Map();

  /** @deprecated */
  valuesByType: {
    [K in keyof UserDataValueTypes]?: Record<string, UserDataValue<K>>;
  } = {};

  isSyncing = false;

  constructor() {
    makeAutoObservable(this, {
      values: observable.shallow,
      // valuesByType: observable.shallow,
    });
  }

  set({
    key,
    value,
    type,
    needsSyncing = true,
    isInitializing = false,
  }: UserDataValueData & {
    isInitializing?: boolean;
  }): UserDataValue {
    if (this.values.has(key)) {
      if (!isInitializing) {
        Object.assign(this.values.get(key)!.value, value);
      }
    } else {
      this.values.set(
        key,
        new UserDataValue(type, key, value, needsSyncing, isInitializing, this),
      );
    }

    return this.values.get(key)!;
    // if (type) {
    //   if (!(type in this.valuesByType)) {
    //     this.valuesByType[type] = {};
    //   }
    //   this.valuesByType[type]![key] = this.values[key];
    // }
  }

  // Todo: only reacts to additions
  observingMap = <T extends Map<any, any>>(
    type: keyof UserDataValueTypes,
    predicate?: Record<string, any>,
  ): T => {
    const map = new Map();

    reaction(
      () => this.values,
      (values, previousValues) => {
        for (const key of values.keys()) {
          if (!previousValues.has(key)) {
            if (values.get(key)!.type === type) {
              map.set(key, values.get(key)!.value);
            }
          }
        }
      },
    );

    return map as T;
  };
}

export const userDataStore = new UserDataStore();

// @ts-ignore
window["userDataStore"] = () => toJS(userDataStore);

/**
 * Syncs the properties of the main store {@link Store}.
 * Must be called before makeAutoObservable
 */
export const makeSynced = <T extends Store | Deck | Row>(obj: T) => {
  let keys: keyof T[];

  // for (const key of keys || Reflect.ownKeys(obj)) {
  //   if (typeof key !== "string") continue;
  //   const value: unknown = Reflect.get(obj, key);
  //   if (!value) continue;
  //   if (value instanceof Map) {
  //     Reflect.set(
  //       obj,
  //       key,
  //       userDataStore.observingMap(key as keyof UserDataValueTypes),
  //     );
  //   } else if (Array.isArray(value) || typeof value === "object") {
  //     Reflect.set(
  //       obj,
  //       key,
  //       userDataStore.set({
  //         key,
  //         value,
  //         type: key as keyof UserDataValueTypes,
  //         isInitializing: true,
  //       }),
  //     );
  //   }
  // }
};
