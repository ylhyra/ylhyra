import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import { ScheduleData } from "flashcards/flashcards/types";
import { SessionLogData, Store } from "flashcards/store";
import { saveUserDataValueInLocalStorage } from "flashcards/userData/localStorage";
import { syncDebounced } from "flashcards/userData/sync";
import {
  UserDataStore,
  userDataStore,
} from "flashcards/userData/userDataStore";
import { isObservable, observable, reaction } from "mobx";

/**
 * The types of data which are stored as {@link UserDataValue}
 * and the values they represent.
 */
export type UserDataValueTypes = {
  deck: DeckSettings;
  row: RowData;
  schedule: ScheduleData;
  sessionLog: SessionLogData;
  userSettings: InstanceType<typeof Store>["userSettings"];
  deckOrder: InstanceType<typeof Store>["deckOrder"];
};

export interface IUserDataValue<
  K extends keyof UserDataValueTypes = keyof UserDataValueTypes,
> {
  type: K;
  key: string;
  value: UserDataValueTypes[K];
  needsSyncing?: boolean;
  updatedAt?: number;
}

/**
 * A wrapper around all values that will be synced to
 * localstorage and to the server.
 * Will observe changes in these values and save them.
 */
export class UserDataValue<K extends keyof UserDataValueTypes = any>
  implements IUserDataValue<K>
{
  constructor(
    public type: K,
    public key: string,
    public value: UserDataValueTypes[K],
    public needsSyncing: boolean = true,
    public updatedAt: number,
    isInitializing: boolean,
    parentClass: UserDataStore,
  ) {
    if (typeof key !== "string") {
      console.warn({ key, value });
      throw new Error("Key must be a string");
    }
    if (!type) {
      console.warn({ key, value });
      throw new Error("Type required");
    }
    if (!isObservable(value)) {
      this.value = observable(value);
    }
    if (!isInitializing) {
      saveUserDataValueInLocalStorage(this);
    }
    reaction(
      () => Object.entries(this.value),
      () => {
        if (!parentClass.isSyncing) {
          this.needsSyncing = true;
          this.updatedAt = Date.now();
          saveUserDataValueInLocalStorage(this);
          syncDebounced();
        }
      },
    );
  }
  getValues(): IUserDataValue<K> {
    return {
      key: this.key,
      value: this.value,
      type: this.type,
      needsSyncing: this.needsSyncing,
      updatedAt: this.updatedAt,
    };
  }
}

export function syncedValue<T extends object>(
  type: keyof UserDataValueTypes,
  key: string,
  value: T,
): T {
  const obs = isObservable(value) ? value : observable.object(value);
  userDataStore.set({
    key,
    value: obs,
    type,
  });
  return obs;
}
