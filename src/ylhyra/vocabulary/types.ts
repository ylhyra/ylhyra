import {
  DifficultyEnum,
  ImportanceEnum,
  LevelsEnum,
} from "ylhyra/vocabulary/app/constants";
import { getSounds } from "ylhyra/vocabulary/compiler/compiler.server/getSounds";
import { Brand } from "ts-brand";
import { Days, Timestamp } from "modules/time";

export type CardData = {
  row_id: number;
  id: CardId;
  /** Deleted in compilation step */
  is_plaintext?: string;
  is_formatted: string;
  /** Deleted in compilation step */
  en_plaintext?: string;
  en_formatted: string;
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

export type VocabularyFileEntry = Partial<{
  "row_id": number;
  "icelandic": string;
  "english": string;
  "lemmas": string;
  "depends_on": string;
  "alternative_id": string;
  "this_is_a_minor_variation_of": string;
  "level": LevelsEnum;
  "importance": ImportanceEnum;
  "difficulty": DifficultyEnum;
  "dont_confuse": string;
  "related_items": string;
  "direction": string;
  "note": string;
  "note_regarding_english": string;
  "literally": string;
  "synonyms": string;
  "pronunciation": string;
  "categories": string;
  "grammar_tags": string;
  "example_declension": string;

  "athugasemd_til_min": string;
  "fix": string;
  "eyða": string;
  "should_teach": "yes" | "no";
  "should_split": "yes" | "no";
  "this is a minor variation of"?: string;
  /** ISO date */
  "last_seen"?: string;
}>;

export type VocabularyFile = {
  rows: VocabularyFileEntry[];
  sound: VocabularyFileSoundEntry[];
};

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
