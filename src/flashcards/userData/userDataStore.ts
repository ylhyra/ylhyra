import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { Row } from "flashcards/flashcards/actions/row/row";
import { Store } from "flashcards/store";
import {
  UserDataValue,
  UserDataValueData,
  UserDataValueTypes,
} from "flashcards/userData/userDataValue";
import { makeObservable, observable, observe, toJS } from "mobx";
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

  /**
   * During initialization, reactions should not
   * run, as it would cause an infinite loop.
   */
  #shouldReact = true;

  constructor() {
    makeObservable(this, {
      values: observable.shallow,
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
  }): UserDataValue["value"] {
    if (this.values.has(key)) {
      // if (!isInitializing) {
      Object.assign(this.values.get(key)!.value, value);
      // }
    } else {
      this.values.set(
        key,
        new UserDataValue(type, key, value, needsSyncing, isInitializing, this),
      );
    }

    return this.values.get(key)!.value;
  }

  // Todo: only reacts to additions
  observingMap = <T extends Map<any, any>>(
    type: keyof UserDataValueTypes,
    predicate?: Record<string, any>,
  ): T => {
    const map = observable.map(new Map(), { deep: false });

    /** React to changes in the key-value store */
    observe(this.values, (change) =>
      this.preventRecursiveReactions(() => {
        console.log("Reacted to this.values");
        console.log(change);
        if (change.type === "add") {
          map.set(change.name, change.newValue);
        }

        // const keys = [...keysIterator];
        // const previousKeys = [...previousKeysIterator];
        // for (const key of keys) {
        //   if (!previousKeys.includes(key)) {
        //     if (this.values.get(key)!.type === type) {
        //       map.set(key, this.values.get(key)!.value);
        //     }
        //   }
        // }
      }),
    );

    /** React to changes in this map */
    observe(map, (change) =>
      this.preventRecursiveReactions(() => {
        console.log("Reacted to changes in map");
        console.log(change);
        if (change.type === "add") {
          this.set({ key: change.name, value: change.newValue, type });
        }

        // const keys = [...keysIterator];
        // const previousKeys = [...previousKeysIterator];
        // for (const key of keys) {
        //   if (!previousKeys.includes(key)) {
        //     this.set({ key: key, value: map.get(key)!.value, type });
        //   }
        // }
      }),
    );

    return map as unknown as T;
  };

  preventRecursiveReactions = (func: Function) => {
    if (!this.#shouldReact) return;
    this.#shouldReact = false;
    func();
    this.#shouldReact = true;
  };
}

export const userDataStore = new UserDataStore();

// @ts-ignore
window["userDataStore"] = userDataStore;
// @ts-ignore
window["userDataStoreJs"] = () => toJS(userDataStore);

/** Must be called before makeAutoObservable */
export const makeSynced = <T extends Store | Deck | Row>(obj: T) => {
  let keys: keyof T[];

  if (obj instanceof Store) {
    // obj.userSettings = userDataStore.
    // obj.decks = userDataStore.
    // obj.deckOrder = userDataStore.
    obj.schedule = userDataStore.observingMap("schedule");
    // obj.sessionLog = userDataStore.
  } else if (obj instanceof Deck) {
  } else if (obj instanceof Row) {
  }

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
