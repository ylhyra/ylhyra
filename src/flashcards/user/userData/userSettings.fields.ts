import { UserSettings } from "flashcards/user/userData/userSettings.types";
import { FieldsSetup } from "modules/form";

export const userSettingsFields: FieldsSetup<UserSettings> = [
  {
    name: "numberOfRatingButtons",
    label: "Number of rating buttons",
    type: "select",
    defaultValue: 3,
    options: [
      {
        value: 3,
        label: `Three buttons ("Bad", "Good", and "Easy")`,
      },
      {
        value: 2,
        label: `Two buttons ("Bad" and "Good")`,
      },
    ],
  },
];
