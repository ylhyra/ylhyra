import { DirectionSettings, Direction } from "flashcards/flashcards/types";
import { FieldsSetup } from "modules/form";

/** Interface form is at {@link deckDataFields} */
export type DeckData = Partial<{
  deleted: boolean;
  title: string;
  topic: string;
  preset:
    | "FOREIGN_LANGUAGE_PERSONAL_USE"
    | "FOREIGN_LANGUAGE_FOR_OTHERS"
    | "NONE";
  frontSideLanguage: string;
  frontSideSpeechSynthesis: boolean;
  backSideLanguage: string;
  backSideSpeechSynthesis: boolean;
  direction: DirectionSettings;
  sideToShowFirst: Direction | "RANDOM";
  automaticDependencies: boolean;
  automaticallyOccludeClashing: boolean;
  schedulingGoal:
    | "MEMORIZE_PERFECTLY"
    | "MEMORIZE_WELL"
    | "SEE_MANY_CARDS"
    | "CRAM";
  schedulingNewCardsPrioritization:
    | "PRIORITIZE_LOWER_RANK"
    | "PRIORITIZE_IMPORTANCE"
    | "PRIORITIZE_RECENTLY_ADDED";
  schedulingSeenCardsPrioritization:
    | "PRIORITIZE_LOWER_RANK"
    | "PRIORITIZE_IMPORTANCE"
    | "PRIORITIZE_FIRST_SEEN"
    | "PRIORITIZE_RECENTLY_SEEN";
  stringReplacements: [];
  newCardPrioritization: "RANDOM" | "OLDEST" | "NEWEST" | "EASIEST" | "HARDEST";
  oldCardPrioritization:
    | DeckData["newCardPrioritization"]
    | "OLDEST_SEEN"
    | "NEWEST_SEEN";
  automaticReplacementsToFindAlternativeId: [];
  /**
   * When the user is playing from all decks at once, this multiplier can be
   * used to make certain decks more important than others
   */
  deckImportanceMultiplier: number;
  formattingStyle: undefined | "DICTIONARY";
  newCardRate: number;
  frequencyOfNewCards: number;
}>;

export const deckDataFields: FieldsSetup<DeckData> = [
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
    defaultValue: "RANDOM",
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
    defaultValue: "RANDOM",
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
  {
    name: "frequencyOfNewCards",
    defaultValue: 1,
    label: "Frequency of new cards",
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
