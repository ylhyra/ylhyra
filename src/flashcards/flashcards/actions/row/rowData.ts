import { DeckId, DirectionSettings } from "flashcards/flashcards/types";
import { DeckData } from "flashcards/flashcards/actions/deck/deckData";
import { Brand } from "ts-brand";
import { FieldsSetup } from "modules/form";

export type RowId = Brand<string, "RowId">;
export type RowIds = RowId[];

/**
 * Raw user input describing a flashcard. See {@link rowFields} for more details.
 *
 * For the processed information, see {@link ProcessedCardExtraInformation} (work
 * in progress)
 */
export class RowData {
  deckId!: DeckId;
  /** Random string */
  rowId!: RowId;
  /** Index of this row in the deck */
  rowNumber!: number;
  front?: string;
  back?: string;
  direction?: DirectionSettings;
  automaticDependencies?: boolean;
  automaticallyDependOnThis?: boolean;
  lemmas?: string;
  sideToShowFirst?: DeckData["sideToShowFirst"];
  deleted?: boolean;
  /**
   * Comma seperated list of entries that the user has to have studied prior to
   * seeing this card
   */
  dependsOn?: string;
  /**
   * Comma seperated list of strings that "redirect" here, i.e. other entries
   * can add this string to their "depends_on" and it will depend on this entry.
   */
  alternativeId?: string;
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
  /** Shown in the interface at the bottom of the card */
  note?: string;
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
  // /** TODO: Not currently used, the intended purpose was to indicate when items were very related (such as just teaching different inflections) in order to allow the user to skip over items that he'd recently seen */
  // "this is a minor variation of"?: string;
  // /** ISO date */
  // "lastSeen"?: string;
  createdAt!: string;
  updatedAt?: string;

  // constructor(data: RowData) {
  //   Object.assign(this, data);
  //   makeAutoObservable(this);
  //   makeSynced(this);
  // }
}

export const rowFields: FieldsSetup<RowData> = [
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
  // {
  //   name: "sideToShowFirst",
  //   label: "Side to show first",
  //   type: "select",
  //   options: [
  //     {
  //       value: "FRONT_SIDE",
  //       label: "Front side",
  //     },
  //     {
  //       value: "RANDOM",
  //       label: "Either side (random)",
  //     },
  //   ],
  //   // onlyShowIf: {
  //   //   key: "preset",
  //   //   is: "FOREIGN_LANGUAGE_PERSONAL_USE",
  //   // },
  // },
  {
    name: "automaticDependencies",
    label: "Automatically find which cards this card depends on",
    defaultValue: true,
    type: "checkbox",
  },
  {
    name: "automaticallyDependOnThis",
    label: "Allow cards to automatically depend on this",
    defaultValue: true,
    type: "checkbox",
    onlyShowIf: (data) => data.automaticDependencies === true,
  },
  { name: "lemmas", label: "Lemmas" },
];
