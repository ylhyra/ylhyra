import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { FieldsSetup } from "modules/form";

/** See type {@link DeckSettings} */
export const deckSettingsFields: FieldsSetup<DeckSettings> = [
  {
    name: "title",
  },
  {
    name: "frontSideLanguage",
    label: "Language of the front side (the side being studied)",
  },
  {
    name: "backSideLanguage",
    label: "Language of the back side (the side containing the explanations)",
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
    onlyShowIf: {
      key: "preset",
      is: "FOREIGN_LANGUAGE_PERSONAL_USE",
    },
  },
  {
    name: "automaticDependencies",
    type: "checkbox",
    defaultValue: true,
    label: "Automatic dependencies",
    description: "Only recommended for languages",
  },
  {
    name: "automaticallyOccludeClashing",
    type: "checkbox",
    defaultValue: true,
    label: "Automatically give hints when two cards have the same prompt",
  },
];
