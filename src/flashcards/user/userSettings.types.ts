import { SyncedData } from "flashcards/userData/syncedData";
import { makeAutoObservable } from "mobx";

/** Interface form is at {@link userSettingsFields} */
export class UserSettings extends SyncedData {
  numberOfRatingButtons?: 3 | 2;
  volume?: boolean;

  constructor() {
    super({ type: "userSettings", key: "userSettings" });
    makeAutoObservable(this);
  }
}
