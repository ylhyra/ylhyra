import {
  UserDataValue,
  UserDataValueData,
  UserDataValueTypes,
} from "flashcards/userData/userDataValue";
import { toJS } from "mobx";
import { getFromLocalStorage } from "modules/localStorage";
import { Timestamp } from "modules/time";

export type UserDataStoreOnServer = {
  userId?: string;
  lastSynced: Timestamp;
  values: {
    [keys: string]: UserDataValueData;
  };
};

/**
 * Key-value store that makes syncing and local storage easier by wrapping each
 * value in a {@link UserDataValue}.
 */
export class UserDataStore {
  /** This value always comes from the server, and it is not compared with the user's clock */
  lastSynced: Timestamp = getFromLocalStorage("lastSynced") || 0;
  userId?: string;
  values: Map<string, UserDataValue> = new Map();

  constructor() {
    // makeObservable(this, {
    //   // remove?
    //   values: observable.shallow,
    // });
  }

  /** @deprecated */
  set<K extends keyof UserDataValueTypes = keyof UserDataValueTypes>(
    input: UserDataValueData<K> & {
      isInitializing?: boolean;
    },
  ): UserDataValue<K> {
    if (this.values.has(input.key)) {
      Object.assign(this.values.get(input.key)!.value, input.value);
    } else {
      this.values.set(
        input.key,
        new UserDataValue(
          input.type,
          input.key,
          input.value,
          input.needsSyncing,
          !input.isInitializing,
        ),
      );
    }

    return this.values.get(input.key)!;
  }

  // // Todo: only reacts to additions
  // derivedMap = <T extends Map<any, any>>(
  //   predicate: (value: UserDataValue) => boolean,
  // ): T => {
  //   const map = observable.map(new Map(), { deep: false });
  //
  //   for (let value of this.values.values()) {
  //     if (predicate(value)) {
  //       updateMap(value);
  //     }
  //   }
  //
  //   /** React to changes in the key-value store */
  //   observe(this.values, (change) => {
  //     action(() => {
  //       if (change.type === "add") {
  //         if (predicate(change.newValue)) {
  //           updateMap(change.newValue);
  //         }
  //       }
  //     })();
  //   });
  //
  //   function updateMap(value: UserDataValue) {
  //     map.set(value.key, value.obj);
  //   }
  //
  //   return map as unknown as T;
  // };
}

export let userDataStore = new UserDataStore();
export function clearUserDataStore() {
  userDataStore = new UserDataStore();
}

// @ts-ignore
window["userDataStore"] = userDataStore;
// @ts-ignore
window["userDataStoreJs"] = () => toJS(userDataStore);
