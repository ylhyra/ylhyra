import { FieldsSetup } from "modules/form";
import { Row } from "flashcards/flashcards/types/row";

export const rowFields: FieldsSetup<Row> = [
  {
    name: "front",
    label: "Front side",
  },
  {
    name: "back",
    label: "Back side",
  },
  {
    name: "direction",
    label: "Which side to show as prompt",
    type: "select",
    defaultValue: "BOTH",
    options: [
      {
        value: "BOTH",
        label: "Both sides can be shown as prompts",
      },
      {
        value: "ONLY_FRONT_TO_BACK",
        label: "Only use front side as a prompt",
      },
      {
        value: "ONLY_BACK_TO_FRONT",
        label: "Only use back side as a prompt",
      },
    ],
  },
  {
    name: "sideToShowFirst",
    label: "Side to show first",
    type: "select",
    options: [
      {
        value: "FRONT_SIDE",
        label: "Front side",
      },
      {
        value: "RANDOM",
        label: "Either side (random)",
      },
    ],
    // onlyShowIf: {
    //   key: "preset",
    //   is: "FOREIGN_LANGUAGE_PERSONAL_USE",
    // },
  },
  {
    name: "automaticDependencies",
    label: "Automatic find which cards this card depends on",
    defaultValue: true,
    type: "checkbox",
  },
  {
    name: "automaticallyDependOnThis",
    label: "Allow cards to automatically depend on this",
    defaultValue: true,
    type: "checkbox",
  },
  { name: "lemmas", label: "Lemmas" },
];
