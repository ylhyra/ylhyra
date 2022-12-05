import { reaction } from "mobx";
import { saveUserDataValueInLocalStorage } from "flashcards/userData/localStorage";
import { Required } from "utility-types";
import { syncDebounced } from "flashcards/userData/sync";

/**
 * A wrapper around all values that will be synced to localstorage and to the
 * server. Will observe changes in these values and save them.
 */
export class SyncedData {
  type!: "deck" | "row" | "schedule" | "sessionLog" | "userSettings";
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
    // if (saveImmediately) {
    //   saveUserDataValueInLocalStorage(this);
    // }

    /** Sync whenever the value changes */
    reaction(
      () => Object.entries(this),
      () => {
        // Todo: Is this recursive??
        this.needsSyncing = true;
        saveUserDataValueInLocalStorage(this);
        syncDebounced();
      },
    );
  }
}
