import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { FieldsSetup } from "modules/form";
import { Direction } from "../../types";

export const deckSettingsFields: FieldsSetup<DeckSettings> = [
  {
    name: "title",
  },
  {
    name: "frontSideLanguage",
    label: "Language of the front side (the side being studied)",
  },
  {
    name: "frontSideSpeechSynthesis",
    label: "Use speech synthesis for the front side",
    type: "checkbox",
    onlyShowIf: (vals) => {
      return Boolean(vals.frontSideLanguage);
    },
  },
  {
    name: "backSideLanguage",
    label: "Language of the back side (the side containing the explanations)",
  },
  {
    name: "backSideSpeechSynthesis",
    label: "Use speech synthesis for the back side",
    type: "checkbox",
    onlyShowIf: (vals) => {
      return Boolean(vals.backSideLanguage);
    },
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
    description: "Which side should be shown first when seeing a new card",
    type: "select",
    options: [
      {
        value: "RANDOM",
        label: "Either side (random)",
      },
      {
        value: Direction.FRONT_TO_BACK,
        label: "Front side",
      },
      {
        value: Direction.BACK_TO_FRONT,
        label: "Back side",
      },
    ],
    onlyShowIf: (vals) => {
      return vals.direction === "BOTH";
    },
  },
  {
    name: "newCardPrioritization",
    label: "Prioritization of new cards",
    type: "select",
    options: [
      {
        value: "RANDOM",
        label: "Choose new cards at random",
      },
      {
        value: "OLDEST",
        label: "Prioritize oldest cards",
      },
      {
        value: "NEWEST",
        label: "Prioritize newest cards",
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
    name: "oldCardPrioritization",
    label: "Prioritization of seen cards",
    type: "select",
    options: [
      {
        value: "RANDOM",
        label: "Random (but stable) prioritization",
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
        value: "OLDEST",
        label: "Prioritize oldest cards (when they were added)",
      },
      {
        value: "NEWEST",
        label: "Prioritize newest cards (when they were added)",
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
  // {
  //   name: "automaticDependencies",
  //   type: "checkbox",
  //   defaultValue: true,
  //   label: "Automatic dependencies",
  //   description: "Only recommended for languages",
  // },
  // {
  //   name: "automaticallyOccludeClashing",
  //   type: "checkbox",
  //   defaultValue: true,
  //   label: "Automatically give hints when two cards have the same prompt",
  // },
  {
    name: "newCardRate",
    defaultValue: 1,
  },
];
