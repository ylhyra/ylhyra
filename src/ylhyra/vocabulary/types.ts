import { Html } from "inflection/tables/types";
import { Days, Timestamp } from "modules/time";
import { Brand } from "ts-brand";
import {
  DifficultyEnum,
  ImportanceEnum,
  LevelsEnum,
} from "ylhyra/vocabulary/app/constants";
import { getSounds } from "ylhyra/vocabulary/compiler/compiler.server/getSounds";

/**
 * This is the processed card data.
 * For the raw vocabulary file entries, see {@link VocabularyFileEntry}
 */
export type CardData = {
  row_id: number;
  id: CardId;
  /** As formatted by {@link formatVocabularyEntry} */
  is_formatted: Html;
  /** As formatted by {@link formatVocabularyEntry} */
  en_formatted: string;
  /** Temporary value deleted in compilation step */
  is_plaintext?: string;
  /** Temporary value deleted in compilation step */
  en_plaintext?: string;
  from: "is" | "en";
  terms: TermIds;
  level: LevelsEnum;
  difficulty?: DifficultyEnum;
  importance?: ImportanceEnum;
  example_declension?: string;
  isSentence?: Boolean;
  lemmas?: string;
  literally?: string;
  note?: string;
  note_regarding_english?: string;
  pronunciation?: string;
  sortKey: number;
  sound: ReturnType<typeof getSounds>;
  spokenSentences?: string[];
  synonyms?: string;

  /** Used in backend, TODO: delete */
  should_teach?: string;
  fix?: string;
  eyða?: string;
};

/**
 * The format of the YAML vocabulary file
 */
export type VocabularyFile = {
  rows: VocabularyFileEntry[];
  sound: VocabularyFileSoundEntry[];
};

export type VocabularyFileEntry = Partial<{
  "row_id": number;
  /**
   * Follows a very specific format, see {@link formatVocabularyEntry}
   */
  "icelandic": string;
  /**
   * Follows a very specific format, see {@link formatVocabularyEntry}
   */
  "english": string;
  /**
   * Lemmas are a list of dictionary forms that are included in this entry.
   * It is a comma or semicolon seperated string.
   * By default, entering a lemma will be interpreted as
   * this entry depending on it ({@link VocabularyFileEntry -> depends_on}.
   *
   * Options:
   *   - To indicate that this entry is the main entry for this lemma,
   *     include the string "%" in it. That will add it to the
   *     {@link VocabularyFileEntry -> alternative_id}
   *   - To indicate that no automatic dependency calculations should be don
   *     include the string "%%".
   */
  "lemmas": string;
  /**
   * Comma seperated list of entries that the user
   * has to have studied prior to seeing this card
   */
  "depends_on": string;
  /**
   * Comma seperated list of strings that "redirect" here,
   * i.e. other entries can add this string to their
   * "depends_on" and it will depend on this entry.
   */
  "alternative_id": string;
  "level": LevelsEnum;
  "importance": ImportanceEnum;
  "difficulty": DifficultyEnum;
  /**
   * Not currently used, the intended purpose was to allow
   * the system to show confusable words at a similar time.
   */
  "dont_confuse": string;
  /**
   * Not currently used, the intended purpose was to allow
   * the system to show related words at a similar time.
   */
  "related_items": string;
  "direction": "->" | "<-";

  /** Shown in the interface at the bottom of the card */
  "note": string;
  /** Shown in the interface at the bottom of the card ONLY when the English side has been shown */
  "note_regarding_english": string;
  /** Shown in the interface at the bottom of the card */
  "literally": string;
  /** Shown in the interface at the bottom of the card */
  "synonyms": string;
  /** Shown in the interface at the bottom of the card */
  "pronunciation": string;
  /** Shown in the interface at the bottom of the card */
  "example_declension": string;

  /* Not currently used */
  "categories": string;
  /* Not currently used */
  "grammar_tags": string;

  "athugasemd_til_min": string;
  "fix": string;
  "eyða": string;
  "should_teach": "yes" | "no";
  "should_split": "yes" | "no";
  /** TODO: Not currently used, the intended purpose was to indicate when items were very related (such as just teaching different inflections) in order to allow the user to skip over items that he'd recently seen */
  "this is a minor variation of"?: string;
  /** ISO date */
  "last_seen"?: string;
}>;

export type VocabularyFileSoundEntry = {
  recording_of: string;
  filename: string;
  speed: string;
  speaker: string;
  date: string;
};

export type DeckDatabase = {
  cards: Cards;
  terms: Terms;
  dependencies: Dependencies;
  alternativeIds: Dependencies;
};
export type Terms = {
  [id: TermId]: { cards: CardIds; dependencies?: TermIdToDependencyDepth };
};
export type Cards = { [key: CardId]: CardData };
export type Dependencies = { [id: TermId]: TermIds };
export type TermIdToDependencyDepth = Record<TermId, number>;

export type CardId = Brand<string, "CardId">;
export type CardIds = Array<CardId>;
export type TermId = Brand<string, "TermId">;
export type TermIds = Array<TermId>;

export interface ScheduleData {
  due: Timestamp;
  last_interval_in_days: Days;
  score: number;
  last_seen: Timestamp;
  sessions_seen: number;

  /* Í VINNSLU */
  last_bad_timestamp: Timestamp;
  number_of_bad_sessions: number;
}
