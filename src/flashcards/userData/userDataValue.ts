import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { Row } from "flashcards/flashcards/actions/row/row";
import { reaction } from "mobx";
import { saveUserDataValueInLocalStorage } from "flashcards/userData/localStorage";
import { syncDebounced } from "flashcards/userData/sync";
import { Required } from "utility-types";
import { UserSettings } from "flashcards/user/userSettings.types";
import {
  ScheduleData,
  SessionLogData,
} from "flashcards/flashcards/actions/session/schedule";

/**
 * The types of data which are stored as {@link SyncedData} and the values they
 * represent.
 */
export const syncedDataTypesToObjects = {
  deck: Deck,
  row: Row,
  schedule: ScheduleData,
  sessionLog: SessionLogData,
  userSettings: UserSettings,
  // deckOrder: InstanceType<typeof Store>["deckOrder"];
};

/**
 * A wrapper around all values that will be synced to localstorage and to the
 * server. Will observe changes in these values and save them.
 */
export class SyncedData {
  type!: keyof typeof syncedDataTypesToObjects;
  key!: string;
  needsSyncing: boolean = true;
  createdAt!: string;
  updatedAt?: string;
  constructor(input: Required<Partial<SyncedData>, "type" | "key">) {
    Object.assign(this, input);

    if (!this.createdAt) {
      this.createdAt = new Date().toISOString();
    }

    if (typeof this.key !== "string") {
      throw new Error("Key must be a string");
    }
    if (!this.type) {
      throw new Error("Type required");
    }
    if (saveImmediately) {
      saveUserDataValueInLocalStorage(this);
    }

    /** Sync whenever the value changes */
    reaction(
      () => Object.entries(this.value),
      () => {
        this.needsSyncing = true;
        saveUserDataValueInLocalStorage(this);
        syncDebounced();
      },
    );
  }
}
