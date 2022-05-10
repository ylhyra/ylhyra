import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { DirectionSettings } from "flashcards/flashcards/types";
import { Brand } from "ts-brand";

export type RowId = Brand<string, "RowId">;
export type RowIds = RowId[];

/**
 * Raw user input describing flashcard
 * See {@link rowFields} for more details.
 *
 * For the processed information, see
 * {@link ProcessedCardExtraInformation} (work in progress)
 */
export type RowData = {
  /** Random string */
  rowId: RowId;
  /** Index of this row in the deck */
  rowNumber: number;
  front?: string;
  back?: string;
  direction?: DirectionSettings;
  automaticDependencies?: boolean;
  automaticallyDependOnThis?: boolean;
  lemmas?: string;
  sideToShowFirst?: DeckSettings["sideToShowFirst"];
  // /**
  //  * Comma seperated list of entries that the user
  //  * has to have studied prior to seeing this card
  //  */
  // "depends_on": string;
  // /**
  //  * Comma seperated list of strings that "redirect" here,
  //  * i.e. other entries can add this string to their
  //  * "depends_on" and it will depend on this entry.
  //  */
  // "alternative_id": string;
  // "level": LevelsEnum;
  // "importance": ImportanceEnum;
  // "difficulty": DifficultyEnum;
  // /**
  //  * Not currently used, the intended purpose was to allow
  //  * the system to show confusable words at a similar time.
  //  */
  // "dont_confuse": string;
  // /**
  //  * Not currently used, the intended purpose was to allow
  //  * the system to show related words at a similar time.
  //  */
  // "related_items": string;
  //
  // /** Shown in the interface at the bottom of the card */
  // "note": string;
  // /** Shown in the interface at the bottom of the card ONLY when the English side has been shown */
  // "note_regarding_english": string;
  // /** Shown in the interface at the bottom of the card */
  // "literally": string;
  // /** Shown in the interface at the bottom of the card */
  // "synonyms": string;
  // /** Shown in the interface at the bottom of the card */
  // "pronunciation": string;
  // /** Shown in the interface at the bottom of the card */
  // "example_declension": string;
  //
  // /* Not currently used */
  // "categories": string;
  // /* Not currently used */
  // "grammar_tags": string;
  //
  // "athugasemd_til_min": string;
  // "fix": string;
  // "eyða": string;
  // "should_teach": "yes" | "no";
  // "should_split": "yes" | "no";
  // /** TODO: Not currently used, the intended purpose was to indicate when items were very related (such as just teaching different inflections) in order to allow the user to skip over items that he'd recently seen */
  // "this is a minor variation of"?: string;
  // /** ISO date */
  // "lastSeen"?: string;
};
