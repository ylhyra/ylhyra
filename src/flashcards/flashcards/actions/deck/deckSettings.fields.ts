import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { FieldsSetup } from "modules/form";

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
    onlyShowIf: (vals) => vals.preset === "FOREIGN_LANGUAGE_PERSONAL_USE",
  },
  {
    name: "sorting",
    type: "select",
    options: [
      {
        value: "RANDOM",
        label: "Prioritize oldest cards (when they were added)",
      },
      {
        value: "OLDEST",
        label: "Prioritize oldest cards (when they were added)",
      },
      {
        value: "NEWEST",
        label: "Prioritize newest cards (when they were added)",
      },
      {
        value: "OLDEST_SEEN",
        label: "Prioritize oldest cards (when you first saw them)",
      },
      {
        value: "NEWEST_SEEN",
        label: "Prioritize newest cards (when you last saw them)",
      },
      {
        value: "EASIEST",
        label: "Prioritize easiest cards",
      },
      {
        value: "HARDEST",
        label: "Prioritize most difficult cards",
      },
    ],
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
