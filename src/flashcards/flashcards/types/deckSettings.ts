import { DirectionSettings } from "flashcards/flashcards/types/types";

/** Interface form is at {@link deckSettingsFields} */
export type DeckSettings = Partial<{
  title: string;
  topic?: string;
  preset?:
    | "FOREIGN_LANGUAGE_PERSONAL_USE"
    | "FOREIGN_LANGUAGE_FOR_OTHERS"
    | "NONE";
  frontSideLanguage: string;
  backSideLanguage: string;
  direction?: DirectionSettings;
  sideToShowFirst?: "FRONT_SIDE" | "RANDOM";
  automaticDependencies?: boolean;
  automaticallyOccludeClashing?: boolean;
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
  automaticReplacementsToFindAlternativeId: [];
  /**
   * When the user is playing from all decks at once,
   * this multiplier can be used to make certain decks more important
   * than others
   */
  deckImportanceMultiplier?: number;
  /**
   * Choose between "Bad - Good" or "Bad - Good - Easy"
   */
  numberOfRatingButtons: 3 | 2;
  formattingStyle?: undefined | "DICTIONARY";
}>;
