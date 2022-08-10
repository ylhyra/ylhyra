import { isObservable, observable, reaction, toJS } from "mobx";
import { isEmpty } from "modules/isEmpty";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import { ScheduleData } from "flashcards/flashcards/types";
import { SessionLogData, Store } from "flashcards/store";
import { saveUserDataValueInLocalStorage } from "flashcards/userData/localStorage";
import { syncDebounced } from "flashcards/userData/sync";
import { userDataStore } from "flashcards/userData/userDataStore";

/**
 * The types of data which are stored as {@link UserDataValue} and the values
 * they represent.
 */
export type UserDataValueTypes = {
  deck: DeckSettings;
  row: RowData;
  schedule: ScheduleData;
  sessionLog: SessionLogData;
  userSettings: InstanceType<typeof Store>["userSettings"];
  // deckOrder: InstanceType<typeof Store>["deckOrder"];
};

export interface UserDataValueData<
  K extends keyof UserDataValueTypes = keyof UserDataValueTypes,
> {
  type: K;
  key: string;
  value: UserDataValueTypes[K];
  needsSyncing?: boolean;
}

/**
 * A wrapper around all values that will be synced to localstorage and to the
 * server. Will observe changes in these values and save them.
 */
export class UserDataValue<K extends keyof UserDataValueTypes = any>
  implements UserDataValueData<K>
{
  constructor(
    public type: K,
    public key: string,
    public value: UserDataValueTypes[K],
    public needsSyncing: boolean = true,
    saveImmediately: boolean = true,
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
    if (saveImmediately && !isEmpty(value)) {
      saveUserDataValueInLocalStorage(this);
    }

    /** Sync whenever the value changes */
    reaction(
      () => Object.entries(this.value),
      () => {
        if (!userDataStore.shouldSync) return;
        this.needsSyncing = true;
        saveUserDataValueInLocalStorage(this);
        syncDebounced();
      },
    );
  }

  getValues(): UserDataValueData<K> {
    return {
      key: this.key,
      value: toJS(this.value),
      type: this.type,
      needsSyncing: this.needsSyncing,
    };
  }
}
