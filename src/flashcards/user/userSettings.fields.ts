import { UserSettings } from "flashcards/user/userSettings.types";
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
  {
    name: "volume",
    type: "checkbox",
    defaultValue: true,
  },
];
