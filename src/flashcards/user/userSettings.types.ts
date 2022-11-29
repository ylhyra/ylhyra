import { SyncedData } from "flashcards/userData/userDataValue";

/** Interface form is at {@link userSettingsFields} */
export class UserSettings extends SyncedData {
  numberOfRatingButtons?: 3 | 2;
  volume?: boolean;
}
