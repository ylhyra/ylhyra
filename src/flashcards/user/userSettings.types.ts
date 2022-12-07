import { SyncedData } from "flashcards/userData/syncedData";
import { makeAutoObservableAll } from "modules/typescript/properties";

/** Interface form is at {@link userSettingsFields} */
export class UserSettings extends SyncedData {
  numberOfRatingButtons?: 3 | 2;
  volume?: boolean;

  constructor() {
    super({ type: "userSettings", key: "userSettings" });

    makeAutoObservableAll(this);
  }
}
